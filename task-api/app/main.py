import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.logging import setup_logging
from app.api.routes import auth,tasks
import time
from fastapi import HTTPException
from sqlalchemy import text
from app.db.session import engine
setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(title="Task Management API", version="1.0.0")
app.include_router(auth.router)
app.include_router(tasks.router)

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

@app.get("/", tags=["meta"])
def root():
    return {
        "status": "online",
        "message": "Task Management API is running",
        "docs": "/docs",
        "health": "/health",
    }

@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}
@app.get("/health/db", tags=["meta"])
def health_db():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        logger.exception("Database health check failed")
        raise HTTPException(status_code=503, detail="Database unavailable")
    return {"database": "ok"}

import os
from fastapi.middleware.cors import CORSMiddleware

cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://task-management-psww.onrender.com",
    "https://task-management-7zys.vercel.app",
    "https://task-management-kok1.vercel.app",
]
env_origins = os.getenv("ALLOWED_ORIGINS", "")
if env_origins:
    cors_origins.extend([o.strip() for o in env_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"^https://.*(onrender\.com|vercel\.app)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s -> %s (%.1f ms)",
        request.method, request.url.path, response.status_code, elapsed_ms,
    )
    return response