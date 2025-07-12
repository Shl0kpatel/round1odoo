import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext.jsx';
import { questionsAPI } from '../services/api';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getQuestions();
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === '' || question.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const popularTags = ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Express', 'CSS', 'HTML', 'Python'];

  const quickActions = [
    { title: 'Ask Question', desc: 'Get help from the community', action: 'ask' },
    { title: 'Browse Questions', desc: 'Find answers to common problems', action: 'browse' },
    { title: 'Join Discussion', desc: 'Share your knowledge', action: 'join' },
    { title: 'Search Topics', desc: 'Explore specific technologies', action: 'search' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%)`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              What's on your mind?
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Share your knowledge, ask questions, and connect with developers worldwide on StackIt
            </p>
            
            {/* Main Search Bar */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ask anything about programming, web development, or technology..."
                  className="w-full pl-12 pr-16 py-5 bg-gray-900/80 border border-gray-700/50 rounded-2xl 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-md
                           text-lg transition-all duration-300 hover:border-gray-600/50"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="px-8 py-4 bg-gray-900/60 hover:bg-gray-800/80 border border-gray-700/50 
                           rounded-2xl text-sm font-medium transition-all duration-300 
                           hover:scale-105 hover:border-blue-500/30 backdrop-blur-md
                           hover:shadow-lg hover:shadow-blue-500/10 transform"
                >
                  {action.title}
                </button>
              ))}
            </div>

            {/* CTA Section */}
            {!isAuthenticated() && (
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-8 backdrop-blur-md 
                            max-w-4xl mx-auto hover:bg-gray-900/70 transition-all duration-300
                            hover:border-gray-700/50 hover:shadow-xl">
                <div className="flex items-center justify-between flex-col md:flex-row gap-6">
                  <div className="text-left">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                                   text-white text-sm font-semibold rounded-full mb-4 shadow-lg">
                      Join StackIt
                    </span>
                    <h3 className="text-2xl font-semibold mb-3 text-white">
                      Connect with developers worldwide
                    </h3>
                    <p className="text-gray-300 text-lg">
                      Share knowledge, ask questions, and grow together in our community.
                    </p>
                  </div>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-white text-black font-semibold rounded-xl 
                             hover:bg-gray-100 transition-all duration-300 flex-shrink-0
                             hover:scale-105 transform shadow-lg hover:shadow-xl"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Smooth Gradient Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
      </div>

      {/* Main Content with smoother transition */}
      <div className="relative bg-black">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/80 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Popular Tags */}
                <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 backdrop-blur-md">
                  <h3 className="text-lg font-semibold mb-4 text-white">Popular Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 
                                  hover:scale-105 transform ${
                          selectedTag === tag
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-700/50 hover:border-gray-600/50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Community Stats */}
                <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 backdrop-blur-md">
                  <h3 className="text-lg font-semibold mb-4 text-white">Community Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
                      <span className="text-gray-300">Questions</span>
                      <span className="text-white font-semibold text-lg">{questions.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
                      <span className="text-gray-300">Answers</span>
                      <span className="text-white font-semibold text-lg">
                        {questions.reduce((acc, q) => acc + (q.answerCount || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
                      <span className="text-gray-300">Active Users</span>
                      <span className="text-white font-semibold text-lg">1.2k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Feed */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Latest Questions</h2>
                {isAuthenticated() && (
                  <Link
                    to="/ask"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                             rounded-lg font-medium transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Ask Question
                  </Link>
                )}
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 animate-pulse">
                      <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                      <div className="h-4 bg-gray-700 rounded mb-4 w-2/3"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MagnifyingGlassIcon className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                  {isAuthenticated() && (
                    <Link
                      to="/ask"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 
                               hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Ask the first question
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredQuestions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question }) => {
  const [userVote, setUserVote] = useState(null); // 1 for upvote, -1 for downvote, null for no vote
  const [currentVoteScore, setCurrentVoteScore] = useState(question.voteScore || 0);
  
  const {
    _id,
    title,
    description,
    tags,
    author,
    views,
    answerCount,
    acceptedAnswer,
    createdAt
  } = question;

  const handleVote = async (voteType, e) => {
    e.preventDefault(); // Prevent navigation when clicking vote buttons
    e.stopPropagation();
    
    const newVote = userVote === voteType ? null : voteType;
    const scoreDiff = newVote === null ? -userVote : (userVote === null ? newVote : newVote - userVote);
    
    setUserVote(newVote);
    setCurrentVoteScore(prev => prev + scoreDiff);
    
    // Here you would typically call an API to update the vote
    // try {
    //   await questionsAPI.voteQuestion(_id, newVote);
    // } catch (error) {
    //   // Revert on error
    //   setUserVote(userVote);
    //   setCurrentVoteScore(currentVoteScore);
    // }
  };

  const getTextPreview = (html, maxLength = 150) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Unknown';
    try {
      const now = new Date();
      const past = new Date(date);
      const diffInSeconds = Math.floor((now - past) / 1000);
      
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Link to={`/questions/${_id}`} className="block group">
      <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 
                    transition-all duration-300 ease-in-out
                    hover:bg-gray-900/80 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10
                    backdrop-blur-md group-hover:scale-[1.02] transform">
        <div className="flex items-start gap-6">
          {/* Vote Score with buttons */}
          <div className="flex flex-col items-center bg-gray-800/60 rounded-xl p-3 min-w-[70px] 
                        backdrop-blur-sm border border-gray-700/50">
            <button
              onClick={(e) => handleVote(1, e)}
              className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                userVote === 1 
                  ? 'text-green-400 bg-green-400/20' 
                  : 'text-gray-400 hover:text-green-400 hover:bg-green-400/10'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <span className="text-lg font-bold text-white my-1 transition-colors duration-200">
              {currentVoteScore}
            </span>
            
            <button
              onClick={(e) => handleVote(-1, e)}
              className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                userVote === -1 
                  ? 'text-red-400 bg-red-400/20' 
                  : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 
                         transition-all duration-300 line-clamp-2">
              {title}
            </h3>
            
            <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
              {getTextPreview(description)}
            </p>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-800/80 text-gray-200 text-xs rounded-lg
                             border border-gray-700/50 backdrop-blur-sm
                             hover:bg-gray-700/80 hover:border-gray-600/50 transition-all duration-200"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-gray-400 text-xs px-2 py-1">+{tags.length - 3} more</span>
                )}
              </div>
            )}

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 bg-gray-800/40 px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  {answerCount || 0} answers
                </span>
                <span className="flex items-center gap-2 bg-gray-800/40 px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {views || 0} views
                </span>
                {acceptedAnswer && (
                  <span className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-lg border border-green-400/20">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Solved
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-gray-500">
                <span className="hover:text-gray-300 transition-colors duration-200">
                  {author?.username || 'Anonymous'}
                </span>
                <span>•</span>
                <span className="hover:text-gray-300 transition-colors duration-200">
                  {formatTimeAgo(createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;
