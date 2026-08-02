from contextlib import asynccontextmanager
from datetime import date, datetime, timezone

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import get_settings
from .database import Base, engine, get_db
from .models import Profile, Task, TaskStatus, User
from .priority import prioritize
from .schemas import (
    LoginRequest,
    Recommendation,
    RegisterRequest,
    TaskCreate,
    TaskResponse,
    TaskUpdate,
    TodayResponse,
    TokenResponse,
)
from .security import create_token, current_user, password_hash


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Career Calendar API",
    version="0.1.0",
    description="A calm, explainable planning API.",
    lifespan=lifespan,
)
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    email = payload.email.lower().strip()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = User(email=email, password_hash=password_hash.hash(payload.password))
    user.profile = Profile(display_name=payload.display_name.strip())
    db.add(user)
    db.commit()
    return TokenResponse(access_token=create_token(user.id))


@app.post("/api/v1/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email.lower().strip()))
    if user is None or not password_hash.verify(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password is incorrect")
    return TokenResponse(access_token=create_token(user.id))


@app.get("/api/v1/tasks", response_model=list[TaskResponse])
def list_tasks(user: User = Depends(current_user), db: Session = Depends(get_db)) -> list[Task]:
    return list(db.scalars(select(Task).where(Task.user_id == user.id).order_by(Task.created_at.desc())))


@app.post("/api/v1/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, user: User = Depends(current_user), db: Session = Depends(get_db)) -> Task:
    task = Task(user_id=user.id, **payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.patch("/api/v1/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, payload: TaskUpdate, user: User = Depends(current_user), db: Session = Depends(get_db)) -> Task:
    task = db.scalar(select(Task).where(Task.id == task_id, Task.user_id == user.id))
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    changes = payload.model_dump(exclude_unset=True)
    if changes.get("status") == TaskStatus.postponed:
        task.postponement_count += 1
    if changes.get("status") == TaskStatus.completed:
        task.completed_at = datetime.now(timezone.utc)
    for key, value in changes.items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task


@app.get("/api/v1/planner/today", response_model=TodayResponse)
def today(user: User = Depends(current_user), db: Session = Depends(get_db)) -> TodayResponse:
    tasks = list(
        db.scalars(
            select(Task).where(
                Task.user_id == user.id,
                Task.status.in_([TaskStatus.todo, TaskStatus.in_progress, TaskStatus.postponed]),
                (Task.planned_for.is_(None)) | (Task.planned_for <= date.today()),
            )
        )
    )
    ranked = sorted(((task, *prioritize(task)) for task in tasks), key=lambda item: item[1], reverse=True)
    top = [Recommendation(task=TaskResponse.model_validate(task), score=score, reasons=reasons) for task, score, reasons in ranked[:3]]
    planned = sum(task.estimate_minutes for task in tasks if task.planned_for == date.today())
    capacity = user.profile.daily_capacity_minutes
    if planned > capacity:
        message = "This plan may be ambitious. Consider moving one task to protect your focus."
    else:
        message = f"You have about {capacity - planned} minutes of flexible capacity today."
    return TodayResponse(top_three=top, planned_minutes=planned, capacity_minutes=capacity, capacity_message=message)
