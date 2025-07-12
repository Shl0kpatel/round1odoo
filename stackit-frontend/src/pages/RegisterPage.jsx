import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../components/UI/LoadingSpinner.jsx';

const RegisterPage = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be less than 30 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
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
            Join StackIt
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              sign in to your account
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900/60 border rounded-xl text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 ${
                  errors.username 
                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                    : 'border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-gray-600/50'
                }`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900/60 border rounded-xl text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 ${
                  errors.password 
                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                    : 'border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-gray-600/50'
                }`}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900/60 border rounded-xl text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 ${
                  errors.confirmPassword 
                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                    : 'border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-gray-600/50'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
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
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
