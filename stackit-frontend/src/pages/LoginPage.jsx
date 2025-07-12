import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../components/UI/LoadingSpinner.jsx';

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated()) {
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const result = await login(formData);
    setIsSubmitting(false);

    if (!result.success) {
      setErrors({ submit: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Sign in to StackIt
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-900/50 border border-red-700/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm">
              {errors.submit}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900/60 border rounded-xl text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                    : 'border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-gray-600/50'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900/60 border rounded-xl text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 ${
                  errors.password 
                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                    : 'border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-gray-600/50'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 
                       text-white font-semibold rounded-xl transition-all duration-300 
                       hover:scale-105 transform shadow-lg hover:shadow-blue-500/25
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
