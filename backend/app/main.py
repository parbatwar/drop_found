from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import (
    User,
    SellerProfile,
    SellerSocialLink,
    Listing,
    ListingImage,
    Order,
    Payment,
    Review,
    Wishlist,
    Follow,
    Notification,
)
from app.routers import auth, seller

app = FastAPI(title="Drop Found API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(seller.router)


@app.get("/")
def root():
    return {"message": "Drop Found API running"}
