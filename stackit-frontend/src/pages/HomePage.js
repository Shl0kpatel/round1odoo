import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { questionsAPI, tagsAPI } from '../services/api';
import QuestionCard from '../components/Questions/QuestionCard';
import TagFilter from '../components/Tags/TagFilter';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: searchParams.get('page') || 1,
        sort: sortBy,
        tag: selectedTag,
        search: searchQuery,
        limit: 10
      };

      const response = await questionsAPI.getQuestions(params);
      setQuestions(response.data.questions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, sortBy, selectedTag, searchQuery]);

  useEffect(() => {
    fetchQuestions();
    fetchPopularTags();
  }, [fetchQuestions]);

  const fetchPopularTags = async () => {
    try {
      const response = await tagsAPI.getPopularTags({ limit: 20 });
      setPopularTags(response.data.tags);
    } catch (error) {
      console.error('Failed to fetch popular tags:', error);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateSearchParams({ sort: newSort, page: 1 });
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
    updateSearchParams({ tag, page: 1 });
  };

  const updateSearchParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.keys(params).forEach(key => {
      if (params[key]) {
        newParams.set(key, params[key]);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    updateSearchParams({ page });
  };

  if (loading && questions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               selectedTag ? `Questions tagged with "${selectedTag}"` :
               'All Questions'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {pagination.totalQuestions || 0} questions
            </p>
          </div>
          
          {isAuthenticated() && (
            <Link
              to="/ask"
              className="btn-primary mt-4 sm:mt-0"
            >
              Ask Question
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleSortChange('recent')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  sortBy === 'recent'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => handleSortChange('popular')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => handleSortChange('votes')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  sortBy === 'votes'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Most Voted
              </button>
            </div>
          </div>

          {/* Clear filters */}
          {(selectedTag || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTag('');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedTag
                  ? 'Try adjusting your search criteria'
                  : 'Be the first to ask a question!'}
              </p>
              {isAuthenticated() && (
                <Link to="/ask" className="btn-primary">
                  Ask the First Question
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          {/* Popular Tags */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Popular Tags</h3>
            </div>
            <div className="card-body">
              <TagFilter
                tags={popularTags}
                selectedTag={selectedTag}
                onTagSelect={handleTagFilter}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Community Stats</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-semibold">{pagination.totalQuestions || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Popular Tags</span>
                  <span className="font-semibold">{popularTags.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message for Guests */}
          {!isAuthenticated() && (
            <div className="card bg-primary-50 border-primary-200">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  Welcome to StackIt!
                </h3>
                <p className="text-primary-700 text-sm mb-4">
                  Join our community to ask questions, share answers, and help others learn.
                </p>
                <div className="space-y-2">
                  <Link to="/register" className="btn-primary w-full text-center block">
                    Sign Up
                  </Link>
                  <Link to="/login" className="btn-secondary w-full text-center block">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
