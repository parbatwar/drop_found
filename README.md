Drop Found

An online thrift and surplus clothing marketplace built for Nepal.

Drop Found connects two kinds of sellers with buyers across Nepal:


Thrift — verified individual thrift shop owners (many already operating on Instagram/TikTok) can create a shop profile and list secondhand clothing for sale.
Surplus — clothing brands, manufacturers, and retailers can list leftover stock, clearance items, and size-cut pieces.


Buyers browse both sections in one place, purchase directly, and track orders — instead of relying on scattered Instagram DMs and informal selling.

Status

🚧 Actively in development — building the MVP.

Working so far:


Authentication (register, login, JWT-based sessions)
Seller onboarding with lightweight verification (thrift & surplus seller types)
Listings (create, browse, update, delete)
Orders (place order, seller order management, status updates)
React frontend with login/register flows connected to the backend


Not built yet:


Reviews, wishlists, follows, notifications
Payments integration (eSewa / Khalti)
Surplus section full build-out
Admin dashboard


Tech Stack

Backend


FastAPI
PostgreSQL
SQLAlchemy + Alembic
JWT authentication


Frontend


React (Vite)
Tailwind CSS
React Router
Axios


Project Structure

drop_found/
├── backend/      → FastAPI application
└── frontend/     → React application

Contributors


Parbat Sunuwar (Jake)
