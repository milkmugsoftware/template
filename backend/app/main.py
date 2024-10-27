from contextlib import asynccontextmanager
from fastapi import FastAPI, BackgroundTasks
from datetime import datetime
import asyncio

import uvicorn
from config import SOFTWARE_NAME
from database import close_db, init_db, get_db
from fastapi import FastAPI
from routers import auth, protected, payment, legal


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize the database
    init_db()

    # Start the session cleanup task
    asyncio.create_task(cleanup_expired_sessions())

    yield
    # Shutdown: close the database connection
    close_db()

async def cleanup_expired_sessions():
    while True:
        try:
            db = get_db()
            db.sessions.delete_many({"expires_at": {"$lt": datetime.utcnow()}})
            await asyncio.sleep(3600)  # Run every hour
        except Exception as e:
            print(f"Error cleaning up sessions: {e}")
            await asyncio.sleep(60)  # Wait a minute before retrying

app = FastAPI(
    lifespan=lifespan,
    title=f"{SOFTWARE_NAME} API",
    description=f"{SOFTWARE_NAME} backend API service",
    version="alpha",
    redoc_url="/redoc",
    docs_url="/swagger"
    )

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(payment.router, prefix="/payment", tags=["Payment"])
app.include_router(protected.router, prefix="/test", tags=["Test (Restricted Routes)"])
app.include_router(legal.router, prefix="/legal", tags=["Legal"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
