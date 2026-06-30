import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Derive active category from current URL path
    // But yo ta main url / home huncha yesma thrift kasasri banunu? //any othjer way or how can we fix or imporve this?
    const activeCategory = location.pathname.startsWith('/surplus') ? 'surplus' : 'thrift';

    const secondaryLinks = [
        { name: 'Tshirts', path: '/thrift/tshirts' },
        { name: 'Pants', path: '/thrift/pants' },
        { name: 'Jackets', path: '/thrift/jackets' },
        { name: 'Accessories', path: '/thrift/accessories' },
        { name: 'Sellers', path: '/thrift/sellers' },
    ];

    return (
        <>
            {/* Primary Navigation */}
            <nav className="sticky top-0 z-50 transition-all duration-300 border-b border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="text-xl font-light tracking-[0.2em] shrink-0">
                            Drop Found
                        </Link>

                        {/* Desktop Primary Nav */}
                        <div className="hidden md:flex items-center space-x-1">
                            <div className="flex items-center bg-gray-50 rounded-full p-1">
                                <Link
                                    to="/thrift"
                                    className={`px-5 py-1.5 text-sm rounded-full transition-all duration-300 ${
                                        activeCategory === 'thrift'
                                            ? 'bg-black text-white shadow-sm'
                                            : 'text-gray-500 hover:text-black hover:bg-gray-100'
                                    }`}
                                >
                                    Thrift
                                </Link>
                                <Link
                                    to="/surplus"
                                    className={`px-5 py-1.5 text-sm rounded-full transition-all duration-300 ${
                                        activeCategory === 'surplus'
                                            ? 'bg-black text-white shadow-sm'
                                            : 'text-gray-500 hover:text-black hover:bg-gray-100'
                                    }`}
                                >
                                    Surplus
                                </Link>
                            </div>
                        </div>

                        {/* Right Side - Auth & Actions */}
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-400 hover:text-black transition-colors hidden sm:block">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            <button className="text-gray-400 hover:text-black transition-colors hidden sm:block">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </button>

                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600 hidden sm:inline">{user.first_name}</span>
                                    <button onClick={logout} className="text-sm text-gray-500 hover:text-black transition-colors">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link to="/login" className="text-sm text-gray-500 hover:text-black transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register" className="text-sm bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
                                        Register
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden text-gray-500 hover:text-black transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-100">
                            <div className="flex flex-col space-y-3">
                                <div className="flex bg-gray-50 rounded-full p-1">
                                    <Link
                                        to="/thrift"
                                        className={`flex-1 text-center px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                                            activeCategory === 'thrift' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Thrift
                                    </Link>
                                    <Link
                                        to="/surplus"
                                        className={`flex-1 text-center px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                                            activeCategory === 'surplus' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Surplus
                                    </Link>
                                </div>

                                <div className="border-t border-gray-100 pt-3 mt-1">
                                    {secondaryLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className="block px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-3 mt-1">
                                    <Link to="/sell" className="block px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                        Sell With Us
                                    </Link>
                                    <Link to="/about" className="block px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                        About
                                    </Link>
                                    <Link to="/help" className="block px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                        Help
                                    </Link>
                                </div>

                                {!user && (
                                    <div className="border-t border-gray-100 pt-3 mt-1">
                                        <Link to="/login" className="block px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                            Login
                                        </Link>
                                        <Link to="/register" className="block px-4 py-2 text-sm bg-black text-white text-center rounded-full hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Secondary Navigation */}
            <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-8 overflow-x-auto py-3">
                        {secondaryLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm whitespace-nowrap transition-colors duration-200 ${
                                    location.pathname === link.path
                                        ? 'text-black font-medium border-b-2 border-black pb-1'
                                        : 'text-gray-400 hover:text-black'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;