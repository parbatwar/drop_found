import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

celery_app = Celery(
    "dropfound",
    broker=REDIS_URL,  # ← where tasks get queued
    backend=REDIS_URL,  # ← where task results get stored
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Celery Beat's schedule: "run this task, this often"
celery_app.conf.beat_schedule = {
    "auto-complete-orders-daily": {
        "task": "app.tasks.order_tasks.run_auto_complete_orders",
        "schedule": 60 * 60 * 24,  # every 24 hours, in seconds
    },
}
