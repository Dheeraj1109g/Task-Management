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

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://task-management-7zys.vercel.app",
    ],
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