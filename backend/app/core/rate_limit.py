import os

from slowapi import Limiter
from slowapi.util import get_remote_address

# get_remote_address function reads the client's IP
# That's the "key" each rate limit counter is tracked per —
# i.e. "5 requests per minute PER IP ADDRESS", not global.


limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=os.getenv("REDIS_URL", "memory://"),
)
