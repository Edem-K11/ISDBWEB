'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Image from 'next/image';

interface BlogContentProps {
  contenu: string;
}

export default function BlogContent({ contenu }: BlogContentProps) {
  return (
    <article className="prose prose-lg prose-slate max-w-none
      prose-headings:font-bold prose-headings:text-gray-900
      prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
      prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6
      prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5
      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
      prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900 prose-strong:font-semibold
      prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
      prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
      prose-li:mb-2
      prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 
      prose-blockquote:pl-6 prose-blockquote:py-2 
      prose-blockquote:bg-indigo-50 prose-blockquote:rounded-r-lg
      prose-code:bg-gray-100 prose-code:text-indigo-600 
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
              <div className="relative w-full h-[400px] my-8 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={src}
                  alt={alt || 'Image du blog'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            );
          },
          
          // Personnaliser les liens
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
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
            <blockquote className="border-l-4 border-indigo-500 pl-6 py-3 my-6 bg-indigo-50 rounded-r-lg italic">
              {children}
            </blockquote>
          ),
          
          // Personnaliser le code inline
          code: ({ inline, children, ...props }: any) => {
            return inline ? (
              <code className="bg-gray-100 text-indigo-600 px-2 py-1 rounded text-sm font-mono" {...props}>
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
  );
}