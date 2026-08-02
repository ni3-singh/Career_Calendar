from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

from app.priority import prioritize


def test_priority_is_explainable_and_bounded():
    now = datetime.now(timezone.utc)
    task = SimpleNamespace(
        importance=5,
        goal_id="goal",
        health_impact=2,
        due_at=now - timedelta(hours=1),
        created_at=now - timedelta(days=10),
        postponement_count=2,
    )
    score, reasons = prioritize(task, now)
    assert score == 100
    assert "Deadline has arrived" in reasons
    assert "A smaller first action may make this easier to start" in reasons
