// components/Navbar.jsx — Light & cohesive with white pages
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnnouncement } from '../hooks/useAnnouncement';
import SearchModal from './SearchModal';

const Icons = {
  Search: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Bag: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Bell: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  ChevronDown: ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Logout: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  External: ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
};

const ACCOUNT_LINKS = [
  { label: 'Purchase History', path: '/orders' },
  { label: 'Saved Wishlist', path: '/wishlist' },
];

const SELLER_LINKS = [
  { label: 'Seller Dashboard', path: '/seller/dashboard' },
  { label: 'Inventory Listings', path: '/seller/listings' },
  { label: 'Store Orders', path: '/seller/orders' },
  { label: 'Shop Settings', path: '/seller/settings' },
];

function Navbar() {
  const { user, logout } = useAuth();
  const { announcements } = useAnnouncement();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount] = useState(2);
  const [notificationCount] = useState(3);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user) return '?';
    const first = user.first_name?.charAt(0) || '';
    const last = user.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  };

  return (
    <>
      {/* Announcement — soft dark strip (small, not full nav) */}
      {announcements.length > 0 && (
        <div className="bg-neutral-900 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-9 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium">
                  {announcements.map((a) => a.content).join('  ·  ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header — light, matches white pages */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-white border-b border-neutral-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-14 gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-baseline gap-0 flex-shrink-0 group">
              <span className="text-[22px] font-semibold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
                Drop
              </span>
              <span className="text-[22px] font-semibold tracking-tight text-red-600">
                Found
              </span>
            </Link>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-lg">
                <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-3 h-9 px-4 
                    bg-white 
                    border border-neutral-300 
                    hover:border-neutral-400 
                    shadow-sm 
                    rounded-3xl
                    text-left 
                    transition-all duration-200 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-neutral-900/10 
                    focus:border-neutral-500"
                >
                <Icons.Search className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                <span className="text-sm text-neutral-500 truncate">
                    Search products, shops and more...
                </span>
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Icons.Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Icons.Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                    {notificationCount}
                  </span>
                )}
              </button>

              <Link
                to="/cart"
                className="relative p-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Cart"
              >
                <Icons.Bag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden sm:block w-px h-5 bg-neutral-200 mx-2" />

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen((v) => !v)}
                    className={`flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-full transition-all duration-200 ${
                      isProfileDropdownOpen
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                    aria-label="Account menu"
                    aria-expanded={isProfileDropdownOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center ring-1 ring-neutral-200/80">
                      <span className="text-[11px] font-semibold text-neutral-700 tracking-wide">
                        {getUserInitials()}
                      </span>
                    </div>
                    <Icons.ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isProfileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-72 origin-top-right bg-white border border-neutral-200/80 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
                        <p className="text-[15px] font-semibold text-neutral-900 tracking-tight">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-neutral-500 mt-0.5 truncate">{user.email}</p>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="inline-flex items-center mt-3 text-xs font-medium text-red-600 hover:text-[#a86820] transition-colors"
                        >
                          Manage account
                          <span className="ml-1">→</span>
                        </Link>
                      </div>

                      <div className="py-2">
                        {ACCOUNT_LINKS.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="block px-5 py-2.5 text-[13.5px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>

                      {(user.role === 'seller' || user.role === 'admin') && (
                        <div className="py-2 border-t border-neutral-100">
                          <p className="px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                            Seller Portal
                          </p>
                          {SELLER_LINKS.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="block px-5 py-2.5 text-[13.5px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      )}

                      {user.role === 'admin' && (
                        <div className="py-2 border-t border-neutral-100">
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center justify-between px-5 py-2.5 text-[13.5px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                              Admin Dashboard
                            </span>
                            <Icons.External className="text-neutral-400" />
                          </Link>
                        </div>
                      )}

                      <div className="py-2 border-t border-neutral-100">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-5 py-2.5 text-[13.5px] text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Icons.Logout className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-1 inline-flex items-center h-9 px-5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Navbar;