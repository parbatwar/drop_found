// src/App.jsx
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Browse from './pages/Browse';

// Admin Pages
import AdminSellers from './pages/admin/AdminSellers';
import AdminCategories from './pages/admin/Categories';

// Seller Pages
import SellerApply from './pages/seller/SellerApply';
import SellerDashboard from './pages/seller/SellerDashboard';
import Listings from './pages/seller/Listings';
import CreateListing from './pages/seller/CreateListing';
import EditListing from './pages/seller/EditListing';
import SellerOrders from './pages/seller/Orders';
import SellerEdit from './pages/seller/SellerEdit';

// Shop Pages
import SellerProfile from './pages/shop/SellerProfile';

// Order Pages
import MyOrders from './pages/orders/MyOrders';
import Checkout from './pages/orders/Checkout';
import Cart from './pages/orders/Cart';
import Wishlist from './pages/Wishlist';

// Product/Listing Pages
import ProductDetail from './pages/listings/ProductDetail';

function App() {
  return (
    <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ========================================================= */}
        {/* 1. PUBLIC LANDING LAYER (Storefront Viewports)           */}
        {/* ========================================================= */}
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:slug" element={<SellerProfile />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/browse" element={<Browse />} />
        </Route>

        {/* ========================================================= */}
        {/* 2. BASE CUSTOMER ACCOUNTS ROUTING ENGINE                 */}
        {/* ========================================================= */}
        <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/apply" element={<SellerApply />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
            </Route>
        </Route>

        {/* ========================================================= */}
        {/* 3. PROTECTED MERCHANT OPERATIONS LAYER (Seller Control)  */}
        {/* ========================================================= */}
        <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
            <Route element={<Layout />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/listings" element={<Listings />} />
                <Route path="/seller/listings/new" element={<CreateListing />} />
                <Route path="/seller/listings/:id/edit" element={<EditListing />} />
                <Route path="/seller/orders" element={<SellerOrders />} />
                <Route path="/seller/shop/edit" element={<SellerEdit />} />
            </Route>
        </Route>

        {/* ========================================================= */}
        {/* 4. PROTECTED ADMINISTRATIVE HUB LAYOUT LAYER (HQ Control) */}
        {/* ========================================================= */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={
                    <div className="p-8 font-light text-neutral-500 uppercase tracking-widest text-xs">
                        Overview Metrics Coming Soon...
                    </div>
                } />
                <Route path="/admin/sellers" element={<AdminSellers />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
            </Route>
        </Route>

        {/* Catch-All Fallback Block */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;