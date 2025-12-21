import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';
import {
  Bold,
  Italic,
  Underline as UnderlineIcn,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcn,
  Image as ImageIcn,
  Highlighter,
  Palette,
  Heading2,
  Heading3,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
  X,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Commencez à écrire...',
  label,
  error,
  required = false,
  className = '',
  minHeight = '200px',
  maxHeight = '500px',
}: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
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
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-4 py-3',
      },
    },
  });

  // Synchroniser le contenu de l'éditeur avec la prop value
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const addImage = () => {
    const url = window.prompt('URL de l\'image :');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      setShowLinkInput(false);
      return;
    }

    setLinkUrl(previousUrl || 'https://');
    setShowLinkInput(true);
  };

  const submitLink = () => {
    if (!editor) return;

    if (linkUrl === '' || linkUrl === 'https://') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }

    setLinkUrl('');
    setShowLinkInput(false);
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    children, 
    active = false, 
    disabled = false,
    title 
  }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? 'bg-green-100 text-green-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  const colors = [
    { value: '#000000', label: 'Noir' },
    { value: '#dc2626', label: 'Rouge' },
    { value: '#16a34a', label: 'Vert' },
    { value: '#2563eb', label: 'Bleu' },
    { value: '#ea580c', label: 'Orange' },
    { value: '#9333ea', label: 'Violet' },
    { value: '#6b7280', label: 'Gris' },
  ];

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className={`border rounded-lg ${error ? 'border-red-300' : 'border-gray-300'}`}>
        {/* Barre d'outils */}
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
          {/* Historique */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Annuler"
            >
              <Undo size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Rétablir"
            >
              <Redo size={18} />
            </ToolbarButton>
          </div>

          {/* Titres */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Titre 2"
            >
              <Heading2 size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive('heading', { level: 3 })}
              title="Titre 3"
            >
              <Heading3 size={18} />
            </ToolbarButton>
          </div>

          {/* Formatage de texte */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Gras"
            >
              <Bold size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italique"
            >
              <Italic size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              title="Souligné"
            >
              <UnderlineIcn size={18} />
            </ToolbarButton>
          </div>

          {/* Alignement */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              title="Aligner à gauche"
            >
              <AlignLeft size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              title="Centrer"
            >
              <AlignCenter size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              title="Aligner à droite"
            >
              <AlignRight size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              active={editor.isActive({ textAlign: 'justify' })}
              title="Justifier"
            >
              <AlignJustify size={18} />
            </ToolbarButton>
          </div>

          {/* Listes */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Liste à puces"
            >
              <List size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Liste numérotée"
            >
              <ListOrdered size={18} />
            </ToolbarButton>
          </div>

          {/* Autres */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="Citation"
            >
              <Quote size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive('codeBlock')}
              title="Bloc de code"
            >
              <Code size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Ligne horizontale"
            >
              <Minus size={18} />
            </ToolbarButton>
          </div>

          {/* Liens et images */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={setLink}
              active={editor.isActive('link')}
              title="Lien"
            >
              <LinkIcn size={18} />
            </ToolbarButton>
            <ToolbarButton onClick={addImage} title="Image">
              <ImageIcn size={18} />
            </ToolbarButton>
          </div>

          {/* Couleurs */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              active={editor.isActive('highlight')}
              title="Surligner"
            >
              <Highlighter size={18} />
            </ToolbarButton>
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Couleur du texte"
              >
                <Palette size={18} />
              </ToolbarButton>
              {showColorPicker && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowColorPicker(false)}
                  />
                  <div className="absolute z-20 top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1 flex-wrap w-40">
                        {colors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => {
                              editor.chain().focus().setColor(color.value).run();
                              setShowColorPicker(false);
                            }}
                            className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                            style={{ backgroundColor: color.value }}
                            title={color.label}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          editor.chain().focus().unsetColor().run();
                          setShowColorPicker(false);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-900 text-left"
                      >
                        Réinitialiser la couleur
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Input pour les liens */}
        {showLinkInput && (
          <div className="bg-blue-50 border-b border-blue-200 p-3">
            <div className="flex gap-2 items-center">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    submitLink();
                  }
                  if (e.key === 'Escape') {
                    setShowLinkInput(false);
                    setLinkUrl('');
                  }
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={submitLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Appliquer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Éditeur */}
        <div className="bg-white">
          <style>{`
            .ProseMirror {
              outline: none;
            }
            
            .ProseMirror p {
              margin: 0.75em 0;
            }
            
            .ProseMirror h2 {
              font-size: 1.5em;
              font-weight: bold;
              margin: 1em 0 0.5em;
              line-height: 1.3;
            }
            
            .ProseMirror h3 {
              font-size: 1.25em;
              font-weight: bold;
              margin: 0.75em 0 0.5em;
              line-height: 1.3;
            }
            
            .ProseMirror ul,
            .ProseMirror ol {
              padding-left: 1.5rem;
              margin: 0.75em 0;
            }
            
            .ProseMirror ul {
              list-style-type: disc;
            }
            
            .ProseMirror ol {
              list-style-type: decimal;
            }
            
            .ProseMirror li {
              margin: 0.25em 0;
              line-height: 1.6;
            }
            
            .ProseMirror li > p {
              margin: 0;
              display: inline;
            }
            
            .ProseMirror blockquote {
              border-left: 4px solid #e5e7eb;
              padding-left: 1rem;
              margin: 1em 0;
              color: #6b7280;
              font-style: italic;
            }
            
            .ProseMirror pre {
              background: #1f2937;
              color: #f3f4f6;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1em 0;
            }
            
            .ProseMirror code {
              background: #f3f4f6;
              color: #1f2937;
              padding: 0.2em 0.4em;
              border-radius: 0.25rem;
              font-size: 0.9em;
              font-family: monospace;
            }
            
            .ProseMirror pre code {
              background: none;
              padding: 0;
              color: inherit;
            }
            
            .ProseMirror hr {
              border: none;
              border-top: 2px solid #e5e7eb;
              margin: 2em 0;
            }
            
            .ProseMirror mark {
              background-color: #fef08a;
              padding: 0.1em 0.2em;
              border-radius: 0.25rem;
            }
            
            .ProseMirror a {
              color: #2563eb;
              text-decoration: underline;
              cursor: pointer;
            }
            
            .ProseMirror a:hover {
              color: #1d4ed8;
            }
            
            .ProseMirror img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5rem;
              margin: 1em 0;
            }
            
            .ProseMirror p.is-editor-empty:first-child::before {
              content: attr(data-placeholder);
              float: left;
              color: #9ca3af;
              pointer-events: none;
              height: 0;
            }
          `}</style>
          <EditorContent
            editor={editor}
            style={{ minHeight, maxHeight }}
            className="overflow-y-auto"
          />
        </div>

        {/* Barre d'informations */}
        <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <div>
            {editor.storage.characterCount.characters()} caractères · {editor.storage.characterCount.words()} mots
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}