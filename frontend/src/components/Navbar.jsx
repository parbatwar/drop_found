// components/Navbar.jsx
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAnnouncement } from '../hooks/useAnnouncement';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { announcements, loading } = useAnnouncement();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);

    // Streamlined core navigation links
    const navLinks = [
        { name: 'Men', path: '/men' },
        { name: 'Women', path: '/women' },
        { name: 'Kids', path: '/kids' },
        { name: 'Unisex', path: '/unisex' },
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

        const getMarqueeContent = () => {
        if (loading) {
            return "Loading announcements...";
        }
        if (announcements.length === 0) {
            return "★ SALE — UP TO 50% OFF • FREE SHIPPING • NEW DROPS EVERY WEEK";
        }
        // Join all announcements with bullet separators
        return announcements.map(a => a.content).join(' • ');
    };

    const marqueeText = getMarqueeContent();

    return (
        <>
            {/* Black Announcement Banner - Only show if announcements exist or use default */}
            {announcements.length > 0 && (
                <div className="bg-black py-1.5 overflow-hidden">
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center">
                            <div className="overflow-hidden whitespace-nowrap">
                                <div className="inline-block animate-marquee">
                                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/80 font-light mx-4">
                                        {announcements.map(a => a.content).join(' • ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Primary Navigation - with subtle scroll effect */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/70 backdrop-blur-sm border-b border-neutral-100/80 shadow-sm' 
                    : 'bg-white/70 border-b border-neutral-100/60'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        
                        {/* Mobile Menu Trigger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-neutral-900 focus:outline-none order-first hover:text-neutral-500 transition-colors"
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

                        {/* Logo */}
                        <Link 
                            to="/" 
                            className="text-lg font-light tracking-[0.3em] uppercase text-black hover:opacity-70 transition-opacity select-none mx-auto md:mx-0"
                        >
                            Drop Found
                        </Link>

                        {/* Centered Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 ${
                                        location.pathname === link.path 
                                            ? 'text-black font-medium' 
                                            : 'text-neutral-400 hover:text-black'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions Block */}
                        <div className="flex items-center space-x-5 order-last">
                            {/* Search */}
                            <button className="text-neutral-400 hover:text-black transition-colors duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Bag / Shopping Cart */}
                            <Link
                                to="/cart"
                                className="text-neutral-400 hover:text-black transition-colors duration-200 relative"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>

                                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-light">
                                    0
                                </span>
                            </Link>

                            {/* Authentication Node */}
                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center focus:outline-none py-1 group"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200 group-hover:border-black transition-colors duration-200">
                                            {user.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.first_name}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px] font-medium tracking-tighter">
                                                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </button>

                                    {/* Refined Dropdown */}
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white border border-neutral-100 shadow-lg py-1 divide-y divide-neutral-100 z-50 animate-slideDown">
                                            <div className="px-4 py-3">
                                                <p className="text-xs uppercase tracking-wider text-neutral-900 font-medium truncate">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="text-[10px] text-neutral-400 truncate mt-0.5 tracking-wide">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <div className="py-1">
                                                <Link to="/profile" className="block px-4 py-2 text-xs text-neutral-500 hover:bg-neutral-50 hover:text-black transition-colors">
                                                    Account Details
                                                </Link>
                                                <Link to="/orders" className="block px-4 py-2 text-xs text-neutral-500 hover:bg-neutral-50 hover:text-black transition-colors">
                                                    Order History
                                                </Link>
                                                <Link to="/wishlist" className="block px-4 py-2 text-xs text-neutral-500 hover:bg-neutral-50 hover:text-black transition-colors">
                                                    Saved Items
                                                </Link>
                                                <Link to="/browse" className="block px-4 py-2 text-xs text-neutral-500 hover:bg-neutral-50 hover:text-black transition-colors">
                                                    Browse Products
                                                </Link>
                                            </div>

                                            {/* Seller Management Options */}
                                            {(user.role === 'seller' || user.role === 'admin') && (
                                                <div className="py-1 bg-neutral-50/50">
                                                    <Link to="/seller/dashboard" className="block px-4 py-2 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-black transition-colors">
                                                        Seller Dashboard
                                                    </Link>
                                                    <Link to="/seller/listings" className="block px-4 py-2 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-black transition-colors">
                                                        Manage Products
                                                    </Link>
                                                    <Link to="/seller/orders" className="block px-4 py-2 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-black transition-colors">
                                                        View Orders
                                                    </Link>
                                                </div>
                                            )}

                                            <div className="py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2.5 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-black transition-colors tracking-wide"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center space-x-4">
                                    <Link to="/login" className="text-[11px] uppercase tracking-[0.15em] text-neutral-400 hover:text-black transition-colors">
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
                <div className="md:hidden fixed inset-x-0 top-[76px] bg-white border-b border-neutral-100 h-screen z-40 px-6 py-8 overflow-y-auto animate-fade-in">
                    <div className="flex flex-col space-y-8">
                        {/* Collection Menu Blocks */}
                        <div className="flex flex-col space-y-5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-lg uppercase tracking-widest text-neutral-800 font-light hover:text-black transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <hr className="border-neutral-100" />

                        {/* Mobile Auth Links */}
                        {!user && (
                            <div className="pt-2 flex flex-col space-y-3">
                                <Link
                                    to="/login"
                                    className="text-center border border-neutral-200 text-neutral-800 py-3 text-[11px] uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-center bg-black text-white py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}

                        {/* Mobile User Links */}
                        {user && (
                            <div className="pt-2 flex flex-col space-y-4">
                                <Link
                                    to="/profile"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Account Details
                                </Link>
                                <Link
                                    to="/orders"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Order History
                                </Link>
                                <Link
                                    to="/wishlist"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Saved Items
                                </Link>
                                {(user.role === 'seller' || user.role === 'admin') && (
                                    <Link
                                        to="/seller/dashboard"
                                        className="text-sm text-neutral-600 hover:text-black transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Seller Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-left text-sm text-neutral-400 hover:text-red-500 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                    display: inline-block;
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </>
    );
}

export default Navbar;