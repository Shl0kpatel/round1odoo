import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { ArrowUpIcon as ArrowUpSolid, ArrowDownIcon as ArrowDownSolid } from '@heroicons/react/24/solid';

const VoteButtons = ({ 
  voteScore, 
  userVote, 
  onVote, 
  isOwner = false, 
  disabled = false,
  showButtons = true,
  size = 'default'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  const iconSize = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  const textSize = {
    small: 'text-sm',
    default: 'text-lg',
    large: 'text-xl'
  };

  if (!showButtons) {
    return (
      <div className="flex flex-col items-center">
        <div className={`flex items-center justify-center ${sizeClasses[size]} text-gray-600`}>
          <ArrowUpIcon className={iconSize[size]} />
        </div>
        <span className={`font-semibold ${textSize[size]} ${voteScore > 0 ? 'text-green-600' : voteScore < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {voteScore}
        </span>
        <div className={`flex items-center justify-center ${sizeClasses[size]} text-gray-600`}>
          <ArrowDownIcon className={iconSize[size]} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      {/* Upvote Button */}
      <button
        onClick={() => !disabled && !isOwner && onVote('up')}
        disabled={disabled || isOwner}
        className={`vote-button upvote ${userVote === 'up' ? 'active' : ''} ${sizeClasses[size]} ${
          disabled || isOwner ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50'
        }`}
        title={isOwner ? "Can't vote on your own content" : "Upvote"}
      >
        {userVote === 'up' ? (
          <ArrowUpSolid className={iconSize[size]} />
        ) : (
          <ArrowUpIcon className={iconSize[size]} />
        )}
      </button>

      {/* Vote Score */}
      <span className={`font-semibold ${textSize[size]} ${
        voteScore > 0 ? 'text-green-600' : 
        voteScore < 0 ? 'text-red-600' : 
        'text-gray-600'
      }`}>
        {voteScore}
      </span>

      {/* Downvote Button */}
      <button
        onClick={() => !disabled && !isOwner && onVote('down')}
        disabled={disabled || isOwner}
        className={`vote-button downvote ${userVote === 'down' ? 'active' : ''} ${sizeClasses[size]} ${
          disabled || isOwner ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'
        }`}
        title={isOwner ? "Can't vote on your own content" : "Downvote"}
      >
        {userVote === 'down' ? (
          <ArrowDownSolid className={iconSize[size]} />
        ) : (
          <ArrowDownIcon className={iconSize[size]} />
        )}
      </button>
    </div>
  );
};

export default VoteButtons;
