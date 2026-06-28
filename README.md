Drop Found
An online clothing marketplace built to connect sellers with buyers:

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

Backend:

FastAPI
PostgreSQL
SQLAlchemy + Alembic
JWT authentication


Frontend:

React (Vite)
Tailwind CSS
React Router
Axios


Project Structure

drop_found/
├── backend/      → FastAPI application
└── frontend/     → React application
