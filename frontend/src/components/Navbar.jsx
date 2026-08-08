import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnnouncement } from '../hooks/useAnnouncement';
import SearchModal from './SearchModal';
import { Icons } from './Icons';

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

const SECONDARY_NAV = [
  { label: 'Men', path: '/browse?gender=men' },
  { label: 'Women', path: '/browse?gender=women' },
  { label: 'Kids', path: '/browse?gender=kids' },
  { label: 'Thrift', path: '/browse?type=thrift_shop' },
  { label: 'Brand New', path: '/browse?type=retail_shop' },
];

const ALL_CATEGORIES = [
  { label: 'Apparel & Fashion', path: '/category/apparel' },
  { label: 'Footwear', path: '/category/footwear' },
  { label: 'Accessories', path: '/category/accessories' },
  { label: 'Vintage & Retro', path: '/category/vintage' },
  { label: 'Streetwear', path: '/category/streetwear' },
];

function Navbar() {
  const { user, logout } = useAuth();
  const { announcements } = useAnnouncement();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount] = useState(2);
  const [notificationCount] = useState(3);

  const dropdownRef = useRef(null);
  const categoriesRef = useRef(null);

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
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setIsCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsProfileDropdownOpen(false);
    setIsCategoriesDropdownOpen(false);
    setIsMobileMenuOpen(false);
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
      {/* Announcement Strip */}
      {announcements.length > 0 && (
        <div className="bg-neutral-900 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-9 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-[11px] tracking-[0.18em] uppercase text-white/70 font-medium">
                  {announcements.map((a) => a.content).join('  ·  ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm'
            : 'bg-white border-b border-neutral-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Open Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              <Link to="/" className="flex items-center gap-0.5 group">
                <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
                  Drop
                </span>
                <span className="text-xl font-bold tracking-tight text-red-500">
                  Found
                </span>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Search products, brands, and shops..."
                  className="w-full h-10 pl-4 pr-11 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-full text-sm text-neutral-800 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-950/10"
                  onFocus={() => setIsSearchOpen(true)}
                />
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="absolute right-1.5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Icons.Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Icons.Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Icons.Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {notificationCount}
                  </span>
                )}
              </button>

              <Link
                to="/cart"
                className="relative p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Cart"
              >
                <Icons.Bag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden sm:block w-px h-5 bg-neutral-200 mx-1.5" />

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen((v) => !v)}
                    className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full transition-all duration-200 ${
                      isProfileDropdownOpen
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                    aria-expanded={isProfileDropdownOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-medium text-xs shadow-inner">
                      {getUserInitials()}
                    </div>
                    <Icons.ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isProfileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 origin-top-right bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-5 pt-4 pb-3 border-b border-neutral-100 bg-neutral-50/50">
                        <p className="text-sm font-semibold text-neutral-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">{user.email}</p>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="inline-flex items-center mt-2.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          Manage account &rarr;
                        </Link>
                      </div>

                      <div className="py-1">
                        {ACCOUNT_LINKS.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="block px-4 py-2.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900 transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>

                      {(user.role === 'seller' || user.role === 'admin') && (
                        <div className="py-1 border-t border-neutral-100">
                          <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Seller Portal
                          </p>
                          {SELLER_LINKS.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="block px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900 transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      )}

                      {user.role === 'admin' && (
                        <div className="py-1 border-t border-neutral-100">
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                              Admin Dashboard
                            </span>
                            <Icons.External className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}

                      <div className="py-1 border-t border-neutral-100">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                  className="ml-1 inline-flex items-center justify-center h-9 px-4 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-colors shadow-sm"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation (Desktop Only) */}
        <div className="hidden md:block bg-neutral-50/80 border-t border-neutral-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 h-11 text-xs">
              
              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button
                  className={`flex items-center gap-2 py-1.5 rounded-lg font-medium transition-colors ${
                    isCategoriesDropdownOpen
                      ? 'bg-neutral-200/70 text-neutral-900'
                      : 'text-neutral-700  hover:text-neutral-900'
                  }`}
                >
                  <span>All Categories</span>
                </button>

                {isCategoriesDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="py-1">
                      {ALL_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.path}
                          to={cat.path}
                          onClick={() => setIsCategoriesDropdownOpen(false)}
                          className="block px-4 py-2.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-4 bg-neutral-300 mx-2" />

              {/* Secondary Navigation Links */}
              {SECONDARY_NAV.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-neutral-900 bg-neutral-200/60 font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/40'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Become a Seller Action Link */}
              <Link
                to="/sell"
                className="ml-auto px-3 py-1.5 font-medium text-neutral-500 hover:text-neutral-900 transition-colors border-l border-neutral-300 pl-4"
              >
                Become a Seller
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Off-canvas Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)} 
          />

          {/* Drawer Body */}
          <div className="relative flex flex-col w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <span className="text-base font-bold text-neutral-900">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Quick links */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Discover
                </p>
                <div className="space-y-1">
                  {SECONDARY_NAV.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Categories
                </p>
                <div className="space-y-1">
                  {ALL_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      className="block px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <Link
                  to="/sell"
                  className="block w-full text-center py-2.5 px-4 text-xs font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Navbar;