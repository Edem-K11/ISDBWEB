'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Image from 'next/image';
import { X } from 'lucide-react';

interface BlogContentProps {
  contenu: string;
}

export default function BlogContent({ contenu }: BlogContentProps) {
  // Lightbox : clic sur une image de l'article pour l'agrandir en plein écran.
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  return (
    <>
    <article className="prose prose-lg prose-slate max-w-none
      prose-headings:font-bold prose-headings:text-gray-900
      prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
      prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6
      prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5
      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
      prose-a:text-isdb-green-600 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900 prose-strong:font-semibold
      prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
      prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
      prose-li:mb-2
      prose-blockquote:border-l-4 prose-blockquote:border-isdb-green-500
      prose-blockquote:pl-6 prose-blockquote:py-2
      prose-blockquote:bg-isdb-green-50 prose-blockquote:rounded-r-lg
      prose-code:bg-gray-100 prose-code:text-isdb-green-600
      prose-code:px-2 prose-code:py-1 prose-code:rounded
      prose-code:text-sm prose-code:font-mono
      prose-pre:bg-gray-900 prose-pre:text-gray-100 
      prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Personnaliser les images
          img: ({ src, alt }) => {
            if (!src || typeof src !== 'string') return null;

            return (
              <button
                type="button"
                onClick={() => setLightbox({ src, alt: alt || 'Image du blog' })}
                className="relative block w-full h-[400px] my-8 rounded-xl overflow-hidden shadow-lg cursor-zoom-in group"
              >
                <Image
                  src={src}
                  alt={alt || 'Image du blog'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </button>
            );
          },
          
          // Personnaliser les liens
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-isdb-green-600 hover:text-isdb-green-800 hover:underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Personnaliser les paragraphes
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4">
              {children}
            </p>
          ),
          
          // Personnaliser les titres
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-6 pb-2 border-b border-gray-200">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-5">
              {children}
            </h3>
          ),
          
          // Personnaliser les listes
          ul: ({ children }) => (
            <ul className="my-6 list-disc pl-6 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 list-decimal pl-6 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed">
              {children}
            </li>
          ),
          
          // Personnaliser les blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-isdb-green-500 pl-6 py-3 my-6 bg-isdb-green-50 rounded-r-lg italic">
              {children}
            </blockquote>
          ),

          // Personnaliser le code inline
          code: ({ inline, children, ...props }: any) => {
            return inline ? (
              <code className="bg-gray-100 text-isdb-green-600 px-2 py-1 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm" {...props}>
                {children}
              </code>
            );
          },
          
          // Personnaliser les code blocks
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
              {children}
            </pre>
          ),
        }}
      >
        {contenu}
      </ReactMarkdown>
    </article>

    {/* Lightbox : fond noir légèrement flouté, clic en dehors de l'image ou sur
        la croix pour fermer, clic sur l'image elle-même sans effet. */}
    {lightbox && (
      <div
        role="dialog"
        aria-modal="true"
        onClick={() => setLightbox(null)}
        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-lightbox-in"
      >
        <button
          type="button"
          onClick={() => setLightbox(null)}
          aria-label="Fermer"
          className="fixed top-5 right-5 z-[110] p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element -- dimensions inconnues, agrandissement libre dans la lightbox */}
        <img
          src={lightbox.src}
          alt={lightbox.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
        />
      </div>
    )}
    </>
  );
}