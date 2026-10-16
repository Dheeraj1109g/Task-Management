import pytest
from app.models.user import UserRole

def test_registration_creates_verification_token(client):
    r = client.post("/auth/register", json={"email": "newuser@example.com", "password": "password123"})
    assert r.status_code == 201
    data = r.json()
    assert data["is_verified"] is False
    assert "verification_token" in data
    assert len(data["verification_token"]) > 10

def test_email_verification_flow(client):
    reg = client.post("/auth/register", json={"email": "verify_me@example.com", "password": "password123"}).json()
    token = reg["verification_token"]

    # Verify with token
    v = client.post("/auth/verify-email", json={"token": token})
    assert v.status_code == 200
    assert v.json()["is_verified"] is True

    # Attempting to verify again with used token fails
    v_again = client.post("/auth/verify-email", json={"token": token})
    assert v_again.status_code == 400

def test_invalid_verification_token(client):
    r = client.post("/auth/verify-email", json={"token": "invalid_fake_token"})
    assert r.status_code == 400
    assert "Invalid verification token" in r.json()["detail"]

def test_demo_login_creates_and_returns_roles(client):
    for role in [UserRole.admin.value, UserRole.manager.value, UserRole.member.value]:
        r = client.post(f"/auth/demo-login/{role}")
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert data["role"] == role
        assert data["user"]["role"] == role
        assert data["user"]["is_verified"] is True

def test_admin_list_and_update_roles(client):
    # Log in as admin
    admin_token = client.post("/auth/demo-login/admin").json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Register normal member
    client.post("/auth/register", json={"email": "employee@example.com", "password": "password123"})

    # List users as admin
    users_res = client.get("/admin/users", headers=admin_headers)
    assert users_res.status_code == 200
    users = users_res.json()
    emp = next(u for u in users if u["email"] == "employee@example.com")
    assert emp["role"] == "member"

    # Promote employee to manager
    patch_res = client.patch(
        f"/admin/users/{emp['id']}/role",
        json={"role": "manager"},
        headers=admin_headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["role"] == "manager"

def test_non_admin_cannot_access_admin_endpoints(client):
    member_token = client.post("/auth/demo-login/member").json()["access_token"]
    member_headers = {"Authorization": f"Bearer {member_token}"}

    r = client.get("/admin/users", headers=member_headers)
    assert r.status_code == 403
    assert "Requires one of the following roles: admin" in r.json()["detail"]

def test_admin_and_manager_can_view_all_tasks(client):
    # Member creates a task
    member_token = client.post("/auth/demo-login/member").json()["access_token"]
    client.post("/tasks", json={"title": "Member Secret Task"}, headers={"Authorization": f"Bearer {member_token}"})

    # Admin lists all tasks
    admin_token = client.post("/auth/demo-login/admin").json()["access_token"]
    admin_all = client.get("/tasks?all=true", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_all.status_code == 200
    titles = [t["title"] for t in admin_all.json()]
    assert "Member Secret Task" in titles

    # Manager lists all tasks
    manager_token = client.post("/auth/demo-login/manager").json()["access_token"]
    manager_all = client.get("/tasks?all=true", headers={"Authorization": f"Bearer {manager_token}"})
    assert manager_all.status_code == 200
    assert "Member Secret Task" in [t["title"] for t in manager_all.json()]

    # Member cannot see other's tasks with ?all=true
    member_all = client.get("/tasks?all=true", headers={"Authorization": f"Bearer {member_token}"})
    assert member_all.status_code == 200
    # Member only gets their own tasks even if they pass ?all=true
    assert len(member_all.json()) == 1
