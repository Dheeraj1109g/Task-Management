def test_requires_auth(client):
    assert client.get("/tasks").status_code == 401


def test_task_crud(client, auth_headers):
    r = client.post("/tasks", json={"title": "Write tests"}, headers=auth_headers)
    assert r.status_code == 201
    task_id = r.json()["id"]

    r = client.patch(f"/tasks/{task_id}", json={"status": "done"}, headers=auth_headers)
    assert r.json()["status"] == "done"

    assert client.delete(f"/tasks/{task_id}", headers=auth_headers).status_code == 204
    assert client.get(f"/tasks/{task_id}", headers=auth_headers).status_code == 404


def test_users_cannot_see_each_others_tasks(client, auth_headers):
    task_id = client.post("/tasks", json={"title": "Private"}, headers=auth_headers).json()["id"]
    client.post("/auth/register", json={"email": "b@example.com", "password": "password123"})
    token = client.post(
        "/auth/login", data={"username": "b@example.com", "password": "password123"}
    ).json()["access_token"]
    other = {"Authorization": f"Bearer {token}"}
    assert client.get(f"/tasks/{task_id}", headers=other).status_code == 404


def test_filter_by_status(client, auth_headers):
    client.post("/tasks", json={"title": "A"}, headers=auth_headers)
    done = client.post("/tasks", json={"title": "B"}, headers=auth_headers).json()
    client.patch(f"/tasks/{done['id']}", json={"status": "done"}, headers=auth_headers)

    r = client.get("/tasks?status=done", headers=auth_headers)
    assert [t["title"] for t in r.json()] == ["B"]


def test_pagination(client, auth_headers):
    for i in range(5):
        client.post("/tasks", json={"title": f"T{i}"}, headers=auth_headers)

    assert len(client.get("/tasks?limit=2&offset=0", headers=auth_headers).json()) == 2
    assert len(client.get("/tasks?limit=2&offset=4", headers=auth_headers).json()) == 1


def test_empty_title_rejected(client, auth_headers):
    r = client.post("/tasks", json={"title": ""}, headers=auth_headers)
    assert r.status_code == 422


def test_invalid_status_filter_rejected(client, auth_headers):
    r = client.get("/tasks?status=banana", headers=auth_headers)
    assert r.status_code == 422


def test_partial_update_keeps_other_fields(client, auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Keep me", "description": "original"},
        headers=auth_headers,
    ).json()
    r = client.patch(f"/tasks/{created['id']}", json={"status": "done"}, headers=auth_headers)
    assert r.json()["title"] == "Keep me"
    assert r.json()["description"] == "original"