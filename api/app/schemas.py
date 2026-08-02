import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .models import TaskStatus


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)
    display_name: str = Field(min_length=1, max_length=80)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    first_action: str | None = Field(default=None, max_length=240)
    category_id: uuid.UUID | None = None
    goal_id: uuid.UUID | None = None
    importance: int = Field(default=3, ge=1, le=5)
    health_impact: int = Field(default=0, ge=0, le=2)
    estimate_minutes: int = Field(default=30, ge=5, le=720)
    due_at: datetime | None = None
    planned_for: date | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    first_action: str | None = Field(default=None, max_length=240)
    status: TaskStatus | None = None
    planned_for: date | None = None
    postponement_reason: str | None = Field(default=None, max_length=160)


class TaskResponse(TaskCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    status: TaskStatus
    postponement_count: int
    created_at: datetime


class Recommendation(BaseModel):
    task: TaskResponse
    score: int
    reasons: list[str]


class TodayResponse(BaseModel):
    top_three: list[Recommendation]
    planned_minutes: int
    capacity_minutes: int
    capacity_message: str
