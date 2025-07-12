import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI, tagsAPI } from '../services/api';
import RichTextEditor from '../components/Editor/RichTextEditor';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: []
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagsAPI.getTags();
      setAvailableTags(response.data.tags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

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

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }));
    if (errors.description) {
      setErrors(prev => ({
        ...prev,
        description: ''
      }));
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
      if (errors.tags) {
        setErrors(prev => ({
          ...prev,
          tags: ''
        }));
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const selectSuggestedTag = (tag) => {
    if (!formData.tags.includes(tag.name) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.name]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.description.trim() || formData.description === '<p></p>') {
      newErrors.description = 'Description is required';
    } else {
      // Strip HTML tags for length check
      const textContent = formData.description.replace(/<[^>]*>/g, '');
      if (textContent.length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
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
    try {
      const response = await questionsAPI.createQuestion(formData);
      toast.success('Question posted successfully!');
      navigate(`/question/${response.data.question._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to post question';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedTags = availableTags
    .filter(tag => 
      tag.name.includes(tagInput.toLowerCase()) && 
      !formData.tags.includes(tag.name)
    )
    .slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
        <p className="text-gray-600">
          Get help from the community by asking a clear, detailed question.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors.submit}
          </div>
        )}

        {/* Title */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Title</h3>
            <p className="text-sm text-gray-600 mt-1">
              Be specific and imagine you're asking a question to another person.
            </p>
          </div>
          <div className="card-body">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., How to implement JWT authentication in Node.js?"
              className={`form-input ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-sm text-gray-600 mt-1">
              Include all the information someone would need to answer your question.
            </p>
          </div>
          <div className="card-body">
            <RichTextEditor
              content={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your problem in detail. Include what you've tried and what you expected to happen..."
              minHeight="200px"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Tags</h3>
            <p className="text-sm text-gray-600 mt-1">
              Add up to 5 tags to describe what your question is about.
            </p>
          </div>
          <div className="card-body">
            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 inline-flex items-center p-0.5 rounded-full text-primary-600 hover:text-primary-800 hover:bg-primary-200"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input */}
            {formData.tags.length < 5 && (
              <div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={addTag}
                  placeholder="Add a tag (press Enter or comma to add)"
                  className="form-input"
                />
                
                {/* Tag Suggestions */}
                {tagInput && suggestedTags.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-md bg-white shadow-sm">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => {
                          selectSuggestedTag(tag);
                          setTagInput('');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium">{tag.name}</span>
                        <span className="text-gray-500 ml-2">({tag.questionsCount} questions)</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {errors.tags && (
              <p className="mt-2 text-sm text-red-600">{errors.tags}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Posting Question...
              </>
            ) : (
              'Post Question'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestionPage;
