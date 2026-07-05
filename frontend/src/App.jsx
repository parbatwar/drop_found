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

// Admin Pages
import AdminSellers from './pages/admin/AdminSellers';

// Seller Pages
import SellerApply from './pages/seller/SellerApply';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProfile from './pages/seller/SellerProfile';
import Listings from './pages/seller/Listings';
import CreateListing from './pages/seller/CreateListing';
import EditListing from './pages/seller/EditListing';
import SellerOrders from './pages/seller/Orders';

// Order Pages
import MyOrders from './pages/orders/MyOrders';
import Checkout from './pages/orders/Checkout';

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
            </Route>
        </Route>

        {/* ========================================================= */}
        {/* 3. PROTECTED MERCHANT OPERATIONS LAYER (Seller Control)  */}
        {/* ========================================================= */}
        <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
            {/* 
               For a quick prototype MVP, you can swap out <Layout /> for a dedicated 
               <SellerLayout /> later if you want a clean seller dashboard view! 
            */}
            <Route element={<Layout />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/listings" element={<Listings />} />
                <Route path="/seller/listings/new" element={<CreateListing />} />
                <Route path="/seller/listings/:id/edit" element={<EditListing />} />
                <Route path="/seller/orders" element={<SellerOrders />} />
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
            </Route>
        </Route>

        {/* Catch-All Fallback Block */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;