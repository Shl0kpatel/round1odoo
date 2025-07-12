import React from 'react';

const TagFilter = ({ tags, selectedTag, onTagSelect }) => {
  if (!tags || tags.length === 0) {
    return (
      <p className="text-gray-500 text-sm">No tags available</p>
    );
  }

  return (
    <div className="space-y-2">
      {tags.map((tag) => (
        <button
          key={tag._id || tag.name}
          onClick={() => onTagSelect(selectedTag === tag.name ? '' : tag.name)}
          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 ${
            selectedTag === tag.name
              ? 'bg-primary-100 text-primary-800 border border-primary-200'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{tag.name}</span>
            <span className="text-sm text-gray-500">
              {tag.questionsCount || 0}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
