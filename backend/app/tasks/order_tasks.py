from app.core.celery_app import celery_app
from app.database import SessionLocal
from app.services.order_service import OrderService


@celery_app.task(name="app.tasks.order_tasks.run_auto_complete_orders")
def run_auto_complete_orders():
    """
    Celery task wrapper around OrderService.auto_complete_orders.
    Opens its own DB session since this runs in a separate worker
    process, not inside a FastAPI request.
    """
    db = SessionLocal()
    try:
        completed_count = OrderService.auto_complete_orders(db)
        print(f"[celery] Auto-completed {completed_count} orders")
        return completed_count
    finally:
        db.close()
