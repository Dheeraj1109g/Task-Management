def test_register_and_login(client):
    r = client.post("/auth/register", json={"email": "x@example.com", "password": "password123"})
    assert r.status_code == 201
    assert "hashed_password" not in r.json()
    r = client.post("/auth/login", data={"username": "x@example.com", "password": "password123"})
    assert r.status_code == 200 and "access_token" in r.json()

def test_duplicate_email_rejected(client):
    body = {"email": "x@example.com", "password": "password123"}
    client.post("/auth/register", json=body)
    assert client.post("/auth/register", json=body).status_code == 409

def test_wrong_password(client):
    client.post("/auth/register", json={"email": "x@example.com", "password": "password123"})
    r = client.post("/auth/login", data={"username": "x@example.com", "password": "wrongpass"})
    assert r.status_code == 401

def test_email_is_case_insensitive(client):
    client.post("/auth/register", json={"email": "Case@Example.com", "password": "password123"})
    r = client.post("/auth/login", data={"username": "CASE@example.COM", "password": "password123"})
    assert r.status_code == 200
    r = client.post("/auth/register", json={"email": "case@example.com", "password": "password123"})
    assert r.status_code == 409    