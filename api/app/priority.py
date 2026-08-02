from datetime import datetime, timezone

from .models import Task


def prioritize(task: Task, now: datetime | None = None) -> tuple[int, list[str]]:
    """Return a stable 0–100 score and plain-language reasons."""
    now = now or datetime.now(timezone.utc)
    score = task.importance * 10
    reasons = [f"Importance is {task.importance} out of 5"]

    if task.goal_id:
        score += 15
        reasons.append("Moves an active goal forward")
    if task.health_impact:
        score += task.health_impact * 8
        reasons.append("Supports your wellbeing")
    if task.due_at:
        due = task.due_at if task.due_at.tzinfo else task.due_at.replace(tzinfo=timezone.utc)
        hours = (due - now).total_seconds() / 3600
        if hours <= 0:
            score += 25
            reasons.append("Deadline has arrived")
        elif hours <= 24:
            score += 20
            reasons.append("Due within 24 hours")
        elif hours <= 72:
            score += 12
            reasons.append("Due within three days")
    created = task.created_at if task.created_at.tzinfo else task.created_at.replace(tzinfo=timezone.utc)
    if (now - created).days >= 7:
        score += 8
        reasons.append("Has been waiting for a week")
    if task.postponement_count >= 2:
        reasons.append("A smaller first action may make this easier to start")
    return min(score, 100), reasons
