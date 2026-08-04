import math
from sqlalchemy.orm import Query


def paginate(query: Query, page: int = 1, limit: int = 20) -> dict:
    """
    Takes an already-filtered, already-ordered SQLAlchemy query and returns
    a pagination envelope: { items, total, page, limit, total_pages, has_next, has_previous }

    Order matters: call query.order_by(...) BEFORE passing it here, since
    .count() ignores ordering anyway, but .offset()/.limit() need it applied
    for the slice to make sense.
    """
    total = query.count()

    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    total_pages = math.ceil(total / limit) if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1,
    }
