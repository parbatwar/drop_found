# Drop Found 👕🛍️

**Nepal's Online Clothing Marketplace** — A full-featured platform connecting thrift shops, retailers, and individual sellers with buyers across Nepal.

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## Overview

Drop Found is Nepal's marketplace for thrift clothing, vintage pieces, and brand new fashion. The platform allows sellers to list items, buyers to discover and purchase unique fashion, and admins to manage the ecosystem.

---

## Key Features

### Authentication & Users
- Google OAuth 2.0 login/registration
- JWT-based authentication with role-based access (buyer, seller, admin)
- User profile management

### Seller System
- Multi-step application with document upload
- Two business types: Registered (with PAN/registration) and Unregistered (individual)
- Two seller types: Thrift Shop and Retail Shop
- Identity & business verification with document storage
- Shop profiles with logos, bios, and contact info
- Follow system for buyers

### Listings & Catalog
- Admin-managed product categories
- Rich attributes: gender, size, condition, color, quantity
- Up to 6 images per listing
- Smart status management based on inventory
- Surplus tags for retail items

### Shopping Experience
- Shopping cart with seller-based grouping
- Wishlist for saved items
- Order groups for multi-seller checkout
- Tiered delivery fees (NPR 80 under 700, NPR 120 for 700+)
- Full order lifecycle tracking
- Reviews & ratings for products and sellers

### Admin Dashboard
- Seller application review with document verification
- Full order management and status control
- Category management
- Platform announcements

---

## Tech Stack

### Backend
- FastAPI - REST API framework
- PostgreSQL - Primary database
- SQLAlchemy - ORM
- Alembic - Database migrations
- JWT + Bcrypt - Authentication
- OAuth2 - Google login
- Cloudinary - Image/document storage

### Frontend
- React - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- React Router - Navigation
- Axios - HTTP client
- Context API - State management

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Cloudinary account
- Google OAuth credentials

