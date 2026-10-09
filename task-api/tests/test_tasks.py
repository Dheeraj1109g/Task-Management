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
    token = client.post("/auth/login", data={"username": "b@example.com", "password": "password123"}).json()["access_token"]
    other = {"Authorization": f"Bearer {token}"}
    assert client.get(f"/tasks/{task_id}", headers=other).status_code == 404