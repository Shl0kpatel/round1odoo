import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  CodeBracketIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder = "Write your content...",
  minHeight = "150px" 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 hover:text-primary-700 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-stackit focus:outline-none',
        style: `min-height: ${minHeight}`,
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2">
        <div className="flex items-center space-x-1 flex-wrap gap-y-1">
          {/* Text formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bold') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Bold"
          >
            <BoldIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('italic') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Italic"
          >
            <ItalicIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('strike') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Strikethrough"
          >
            <StrikethroughIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Headings */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Heading 1"
          >
            H1
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Heading 2"
          >
            H2
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Heading 3"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bulletList') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Bullet List"
          >
            <ListBulletIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('orderedList') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Numbered List"
          >
            <NumberedListIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Text alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Align Left"
          >
            ⇤
          </button>
          
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Align Center"
          >
            ≡
          </button>
          
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Align Right"
          >
            ⇥
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Code and Link */}
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('code') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Inline Code"
          >
            <CodeBracketIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('link') ? 'bg-gray-200 text-primary-600' : 'text-gray-600'
            }`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Emoji button (simple implementation) */}
          <button
            onClick={() => {
              const emoji = window.prompt('Enter emoji:');
              if (emoji) {
                editor.chain().focus().insertContent(emoji).run();
              }
            }}
            className="p-2 rounded text-gray-600 hover:bg-gray-200"
            title="Add Emoji"
          >
            😀
          </button>

          {/* Image placeholder (basic implementation) */}
          <button
            onClick={() => {
              const url = window.prompt('Image URL:');
              if (url) {
                editor.chain().focus().insertContent(`<img src="${url}" alt="Image" />`).run();
              }
            }}
            className="p-2 rounded text-gray-600 hover:bg-gray-200"
            title="Add Image"
          >
            <PhotoIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="p-4">
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
