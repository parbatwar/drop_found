import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';

import SellerApply from './pages/seller/SellerApply';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProfile from './pages/seller/SellerProfile';
import Listings from './pages/seller/Listings';
import CreateListing from './pages/seller/CreateListing';
import EditListing from './pages/seller/EditListing';

function App() {
  return (
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Public Routes with Layout */}
        <Route element={<Layout />}>
            <Route path="/" element={<Home />} />

            {/* Public seller profile */}
            <Route path="/seller/:slug" element={<SellerProfile />} />
        </Route>

        {/* Protected Routes - Require Login */}
        <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
                <Route path="/apply" element={<SellerApply />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/listings" element={<Listings />} />
                <Route path="/seller/listings/new" element={<CreateListing />} />
                <Route path="/seller/listings/:id/edit" element={<EditListing />} />
            </Route>
        </Route>

        <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;