import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.logging import setup_logging
from app.api.routes import auth,tasks
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