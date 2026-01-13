'use client'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Standard interface for props
interface WikiProps {
  content: string;
}

export default function WikiRenderer({ content }: WikiProps) {
  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#1e1e1e]">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, className, children, ...props }: any) {
             const match = /language-(\w+)/.exec(className || '')
             const { ref, ...rest } = props;
             
             return match ? (
               <SyntaxHighlighter
                 style={vscDarkPlus as any} 
                 language={match[1]}
                 PreTag="div"
                 {...rest}
               >
                 {String(children).replace(/\n$/, '')}
               </SyntaxHighlighter>
             ) : (
               <code className={className} {...rest}>{children}</code>
             )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}