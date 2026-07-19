// components/admin/AdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../Icons'; // ✅ Import from central Icons file

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    const menuItems = [
        { path: '/admin/dashboard', label: 'Overview', icon: Icons.Dashboard },
        { path: '/admin/orders', label: 'Orders', icon: Icons.Package },
        { path: '/admin/sellers', label: 'Pending Sellers', icon: Icons.Users },
        { path: '/admin/categories', label: 'Categories', icon: Icons.Categories },
        { path: '/admin/announcements', label: 'Announcements', icon: Icons.Megaphone },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-neutral-100 flex-shrink-0 flex flex-col h-screen sticky top-0">
                {/* Brand */}
                <div className="px-6 pt-8 pb-6 border-b border-neutral-100">
                    <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-400 font-medium block mb-1">
                        Admin
                    </span>
                    <h1 className="text-lg font-light tracking-[0.15em] text-black">
                        Control Panel
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        if (!Icon) {
                            console.warn(`Icon missing for ${item.label}`);
                            return null; // Skip rendering this item
                        }

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                // Ensure this whole block is inside the backticks ``
                                className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider uppercase rounded-sm transition-all duration-200 ${
                                    isActive
                                        ? 'bg-black text-white'
                                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                                }`}
                            >
                                {/* Make sure the Icon is valid before rendering */}
                                {Icon && (
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                                )}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="px-4 py-6 border-t border-neutral-100 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase text-neutral-400 hover:text-black transition-colors py-2"
                    >
                        <Icons.Store className="w-3.5 h-3.5" />
                        View Store
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full text-[10px] tracking-widest uppercase text-neutral-400 hover:text-red-500 transition-colors py-2"
                    >
                        <Icons.Logout className="w-3.5 h-3.5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-neutral-50 min-h-screen p-8">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;