// pages/seller/SellerDashboard.jsx
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function SellerDashboard() {
    const { user } = useAuth();

    const quickActions = [
        { id: 1, name: 'Add New Product', path: '/seller/listings/new' },
        { id: 2, name: 'Manage Products', path: '/seller/listings' },
        { id: 3, name: 'View Sales', path: '/seller/sales' },
        { id: 4, name: 'ViewOrders', path: '/seller/orders' },
        { id: 5, name: 'Analytics', path: '/seller/analytics' },
        { id: 6, name: 'Manage Shop', path: '/seller/shop' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-light">Seller Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Welcome back, {user?.first_name}!
                </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickActions.map((action) => (
                    <Link
                        key={action.id}
                        to={action.path}
                        className="border border-gray-200 px-4 py-3 text-sm text-center hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                        {action.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SellerDashboard;