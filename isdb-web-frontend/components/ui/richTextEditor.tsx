

// components/ui/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Palette,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  height?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Saisissez votre contenu...',
  label,
  error,
  required = false,
  className,
  height = '400px',
}: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[200px]',
      },
    },
  });

  const addImage = () => {
    const url = window.prompt('URL de l\'image');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || 'https://');

    if (showLinkInput) {
      setShowLinkInput(false);
    } else {
      setShowLinkInput(true);
    }
  };

  const submitLink = () => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }

    setLinkUrl('');
    setShowLinkInput(false);
  };

  if (!editor) {
    return null;
  }

  const MenuButton = ({ onClick, children, active = false }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-2 rounded-lg transition-colors',
        active
          ? 'bg-isdb-green-100 text-isdb-green-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Barre d'outils */}
      <div className="bg-gray-50 border border-gray-200 rounded-t-lg p-2 flex flex-wrap gap-1">
        {/* Formatage de texte */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          >
            <Bold size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          >
            <Italic size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
          >
            <UnderlineIcon size={18} />
          </MenuButton>
        </div>

        {/* Alignement */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
          >
            <AlignLeft size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
          >
            <AlignCenter size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
          >
            <AlignRight size={18} />
          </MenuButton>
        </div>

        {/* Listes */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          >
            <List size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
          >
            <ListOrdered size={18} />
          </MenuButton>
        </div>

        {/* Liens et images */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <MenuButton onClick={setLink} active={editor.isActive('link')}>
            <LinkIcon size={18} />
          </MenuButton>
          <MenuButton onClick={addImage}>
            <ImageIcon size={18} />
          </MenuButton>
        </div>

        {/* Couleurs */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive('highlight')}
          >
            <Highlighter size={18} />
          </MenuButton>
          <div className="relative group">
            <MenuButton>
              <Palette size={18} />
            </MenuButton>
            <div className="absolute z-10 hidden group-hover:flex flex-wrap gap-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg w-40">
              {['#000000', '#206b38', '#dc2c42', '#3b82f6', '#f59e0b', '#8b5cf6'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Nettoyer */}
        <div className="ml-auto">
          <MenuButton onClick={() => editor.chain().focus().clearContent().run()}>
            <Trash2 size={18} />
          </MenuButton>
        </div>
      </div>

      {/* Input pour les liens */}
      {showLinkInput && (
        <div className="bg-gray-100 border border-gray-200 p-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && submitLink()}
            />
            <button
              type="button"
              onClick={submitLink}
              className="px-4 py-2 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}

      {/* Éditeur */}
      <div className={cn(
        'border border-gray-300 border-t-0 rounded-b-lg overflow-hidden',
        error && 'border-red-300'
      )}>
        <EditorContent
          editor={editor}
          style={{ height, maxHeight: height }}
          className="overflow-y-auto p-4"
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Informations */}
      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
        <div>
          {editor.storage.characterCount
            ? `${editor.storage.characterCount.characters()} caractères`
            : ''}
        </div>
        <div className="space-x-4">
          <button
            type="button"
            onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
            className="hover:text-isdb-green-600"
          >
            Titre 2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
            className="hover:text-isdb-green-600"
          >
            Titre 3
          </button>
        </div>
      </div>
    </div>
  );
}