import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  ChatBubbleLeftIcon, 
  EyeIcon, 
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import VoteButtons from '../UI/VoteButtons';

const QuestionCard = ({ question }) => {
  const {
    _id,
    title,
    description,
    tags,
    author,
    voteScore,
    views,
    answerCount,
    acceptedAnswer,
    createdAt,
    userVote,
    isOwner
  } = question;

  // Extract plain text from HTML content for preview
  const getTextPreview = (html, maxLength = 150) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex space-x-4">
          {/* Vote Score */}
          <div className="flex-shrink-0">
            <VoteButtons
              voteScore={voteScore}
              userVote={userVote}
              onVote={() => {}} // Will be implemented in QuestionDetailPage
              isOwner={isOwner}
              disabled={true} // Disable voting from question card
              showButtons={false} // Only show score
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="mb-3">
              <Link
                to={`/question/${_id}`}
                className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-150"
              >
                {title}
              </Link>
            </div>

            {/* Description Preview */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                {getTextPreview(description)}
              </p>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/?tag=${encodeURIComponent(tag)}`}
                    className="tag tag-blue hover:bg-blue-200 transition-colors duration-150"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              {/* Stats */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  <span className={answerCount > 0 ? 'text-gray-700 font-medium' : ''}>
                    {answerCount} answer{answerCount !== 1 ? 's' : ''}
                  </span>
                  {acceptedAnswer && (
                    <CheckCircleIcon className="h-4 w-4 text-green-500 ml-1" />
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <EyeIcon className="h-4 w-4" />
                  <span>{views} view{views !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Author and Date */}
              <div className="flex items-center space-x-3">
                <span>
                  asked {formatDistanceToNow(new Date(createdAt), { addSuffix: true })} by
                </span>
                <Link
                  to={`/profile/${author.username}`}
                  className="flex items-center space-x-2 hover:text-primary-600 transition-colors duration-150"
                >
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt={author.username}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {author.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-medium">{author.username}</span>
                  <span className="text-xs">({author.reputation})</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
