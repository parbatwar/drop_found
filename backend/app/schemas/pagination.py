from typing import List, TypeVar, Generic
from pydantic import BaseModel

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Standard pagination response.
    """

    items: List[T]  # The actual data
    total: int  # Total items in database
    page: int  # Current page number
    limit: int  # Items per page
    total_pages: int  # Total pages available
    has_next: bool  # Can user go to next page?
    has_previous: bool  # Can user go to previous page?
