def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_registration_rejects_duplicate_email(client):
    body = {"email": "ALEX@example.com", "password": "strong-password", "display_name": "Alex"}
    assert client.post("/api/v1/auth/register", json=body).status_code == 201
    response = client.post("/api/v1/auth/register", json=body)
    assert response.status_code == 409
    assert response.json()["detail"] == "An account with this email already exists"


def test_task_workflow_and_today_recommendation(client, auth_headers):
    response = client.post(
        "/api/v1/tasks",
        headers=auth_headers,
        json={"title": "Draft the proposal", "first_action": "Open the brief", "importance": 5, "estimate_minutes": 45},
    )
    assert response.status_code == 201
    task = response.json()
    today = client.get("/api/v1/planner/today", headers=auth_headers)
    assert today.status_code == 200
    assert today.json()["top_three"][0]["task"]["title"] == "Draft the proposal"
    assert today.json()["top_three"][0]["reasons"] == ["Importance is 5 out of 5"]

    completed = client.patch(f"/api/v1/tasks/{task['id']}", headers=auth_headers, json={"status": "completed"})
    assert completed.status_code == 200
    assert completed.json()["status"] == "completed"


def test_tasks_require_authentication(client):
    assert client.get("/api/v1/tasks").status_code == 401
