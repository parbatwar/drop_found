// src/components/admin/AdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    const menuItems = [
        { path: '/admin/dashboard', label: 'Overview' },
        { path: '/admin/sellers', label: 'Pending Sellers' },
        { path: '/admin/categories', label: 'Categories' },
        // Future tabs can go here seamlessly (e.g., Reports, Listings)
    ];

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-neutral-200 p-6 flex flex-col justify-between">
                <div className="space-y-8">
                    {/* Brand Banner */}
                    <div className="space-y-1">
                        <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-400 font-bold block">
                            Platform HQ
                        </span>
                        <h2 className="text-sm font-semibold tracking-wider uppercase text-black">
                            Admin Control
                        </h2>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`block px-3 py-2.5 text-xs tracking-wider uppercase rounded-sm transition-colors duration-200 ${
                                        isActive
                                            ? 'bg-black text-white font-medium'
                                            : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Back to Site / Exit Operations */}
                <div className="pt-6 border-t border-neutral-100 mt-6 space-y-2">
                    <Link
                        to="/"
                        className="block text-center text-[10px] tracking-widest uppercase border border-neutral-200 text-neutral-600 py-2 hover:border-black hover:text-black transition-colors rounded-sm"
                    >
                        View Live Store
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-center text-[10px] tracking-widest uppercase text-red-600 py-2 hover:bg-red-50 transition-colors rounded-sm"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Admin Content Area Context Canvas */}
            <main className="flex-1 bg-neutral-50 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;