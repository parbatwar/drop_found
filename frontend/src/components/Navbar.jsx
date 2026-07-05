// components/Navbar.jsx
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Streamlined core navigation links
    const navLinks = [
        { name: 'Sale', path: '/category/sale' },
        { name: 'Men', path: '/category/men' },
        { name: 'Women', path: '/category/women' },
        { name: 'Unisex', path: '/category/unisex' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        setIsProfileDropdownOpen(false);
        await logout();
        navigate('/login');
    };

    return (
        <>
            {/* Primary Navigation */}
            <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        
                        {/* Mobile Menu Trigger (Left-aligned on mobile) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-neutral-900 focus:outline-none order-first"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 8h16M4 16h16" />
                                )}
                            </svg>
                        </button>

                        {/* Logo - High-end typography tracking */}
                        <Link to="/" className="text-xl font-normal tracking-[0.25em] uppercase text-black select-none mx-auto md:mx-0">
                            Drop Found
                        </Link>

                        {/* Centered Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-xs uppercase tracking-widest transition-colors duration-200 ${
                                        location.pathname === link.path ? 'text-black font-medium' : 'text-neutral-400 hover:text-black'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions Block */}
                        <div className="flex items-center space-x-5 order-last">
                            {/* Search */}
                            <button className="text-neutral-900 hover:text-neutral-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Bag / Shopping Cart */}
                            <button className="text-neutral-900 hover:text-neutral-400 transition-colors relative">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-light">
                                    0
                                </span>
                            </button>

                            {/* Authentication Node */}
                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center focus:outline-none py-1"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200 transition-colors">
                                            {user.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.first_name}
                                                    className="w-full h-full object-cover grayscale"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px] font-medium tracking-tighter">
                                                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </button>

                                    {/* Monochromatic Clean Dropdown */}
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white border border-neutral-200 py-2 divide-y divide-neutral-100 z-50">
                                            <div className="px-4 py-2.5">
                                                <p className="text-xs uppercase tracking-wider text-neutral-900 font-medium truncate">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <div className="py-1">
                                                <Link to="/profile" className="block px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-black">
                                                    Account Details
                                                </Link>
                                                <Link to="/orders" className="block px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-black">
                                                    Order History
                                                </Link>
                                                <Link to="/wishlist" className="block px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-black">
                                                    Saved Items
                                                </Link>
                                            </div>

                                            {/* Seller Management Options */}
                                            {(user.role === 'seller' || user.role === 'admin') && (
                                                <div className="py-1 bg-neutral-50">
                                                    <Link to="/seller/dashboard" className="block px-4 py-2 text-xs text-neutral-500 hover:text-black">
                                                        Seller Dashboard
                                                    </Link>
                                                    <Link to="/seller/listings" className="block px-4 py-2 text-xs text-neutral-500 hover:text-black">
                                                        Manage Products
                                                    </Link>
                                                    <Link to="/seller/sales" className="block px-4 py-2 text-xs text-neutral-500 hover:text-black">
                                                        View Orders
                                                    </Link>
                                                </div>
                                            )}

                                            <div className="py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-xs text-neutral-900 font-medium hover:bg-neutral-50 transition-colors"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center space-x-4">
                                    <Link to="/login" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-neutral-200 h-screen z-40 px-6 py-6 overflow-y-auto animate-fade-in">
                    <div className="flex flex-col space-y-6">
                        {/* Collection Menu Blocks */}
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-lg uppercase tracking-widest text-neutral-900 font-light"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <hr className="border-neutral-100" />

                        {!user && (
                            <div className="pt-4 flex flex-col space-y-3">
                                <Link
                                    to="/login"
                                    className="text-center border border-neutral-900 text-neutral-900 py-3 text-xs uppercase tracking-widest font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-center bg-black text-white py-3 text-xs uppercase tracking-widest font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;