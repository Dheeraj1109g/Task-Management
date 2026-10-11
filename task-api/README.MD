# Task Management API

Backend for a task manager: FastAPI, PostgreSQL, SQLAlchemy, Alembic, JWT auth.

**Live API docs:** https://YOUR-SERVICE.onrender.com/docs
**Frontend:** https://task-management-kok1.vercel.app

## Features
- Register and login with JWT access tokens (bcrypt-hashed passwords)
- Task CRUD, scoped per user (users can never see each other's tasks)
- Filter by status, with pagination (`?status=done&limit=20&offset=0`)
- Alembic migrations, pytest suite, Docker support, CI

## Run locally
```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # then fill in values
alembic upgrade head
uvicorn app.main:app --reload
```

## Run with Docker
```bash
docker compose up --build
```

## Tests
```bash
pytest -v
```

## Environment variables
| Name | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Signs JWT tokens (use a long random value) |

## Design notes
- Auth is stateless: the server signs a token and verifies it on each request.
- Every task query filters by `owner_id`, and other users' tasks return 404.
- Schema changes go through Alembic migrations, never manual SQL.