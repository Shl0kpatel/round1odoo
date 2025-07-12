import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { notificationsAPI } from '../../services/api';
import NotificationDropdown from '../Notifications/NotificationDropdown.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center 
                            group-hover:scale-105 transition-transform duration-200 shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                StackIt
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/60 border border-gray-700/50 rounded-xl 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm
                           transition-all duration-300 hover:border-gray-600/50"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                <Link
                  to="/ask"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl 
                           transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-blue-500/25"
                >
                  Ask Question
                </Link>

                {/* Notifications */}
                <NotificationDropdown 
                  unreadCount={unreadCount}
                  onNotificationRead={fetchUnreadCount}
                />

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-3 p-2.5 rounded-xl bg-gray-900/50 
                                       hover:bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 
                                       transition-all duration-300">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-700"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-200">
                      {user?.username}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md 
                                         rounded-xl shadow-xl border border-gray-700/50 ring-1 ring-black/20 
                                         focus:outline-none z-50">
                      <div className="py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/profile/${user?.username}`}
                              className={`${
                                active ? 'bg-gray-800/60' : ''
                              } block px-4 py-3 text-sm text-gray-200 hover:text-white transition-colors duration-200`}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/notifications"
                              className={`${
                                active ? 'bg-gray-800/60' : ''
                              } block px-4 py-3 text-sm text-gray-200 hover:text-white transition-colors duration-200`}
                            >
                              Notifications
                            </Link>
                          )}
                        </Menu.Item>
                        {isAdmin() && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/admin"
                                className={`${
                                  active ? 'bg-gray-800/60' : ''
                                } block px-4 py-3 text-sm text-gray-200 hover:text-white transition-colors duration-200`}
                              >
                                Admin Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        <hr className="my-2 border-gray-700/50" />
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-gray-800/60' : ''
                              } block w-full text-left px-4 py-3 text-sm text-gray-200 hover:text-white 
                                transition-colors duration-200`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl 
                           transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-blue-500/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/60 
                       transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 py-4 bg-gray-900/60 backdrop-blur-md">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>
            </form>

            {isAuthenticated() ? (
              <div className="space-y-3">
                <Link
                  to="/ask"
                  className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white 
                           font-semibold rounded-xl text-center transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ask Question
                </Link>
                <Link
                  to={`/profile/${user?.username}`}
                  className="block py-3 text-gray-200 hover:text-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/notifications"
                  className="block py-3 text-gray-200 hover:text-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="block py-3 text-gray-200 hover:text-white transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 text-gray-200 hover:text-white transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block py-3 text-gray-200 hover:text-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white 
                           font-semibold rounded-xl text-center transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
