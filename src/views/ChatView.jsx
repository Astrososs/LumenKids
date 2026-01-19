import { useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

function normalizeMarkdown(text) {
  if (!text) return '';
  let t = String(text).replace(/\r\n/g, '\n');

  t = t
    .replace(/([^\n])\s(\*\s+)/g, '$1\n$2')
    .replace(/([^\n])\s(-\s+)/g, '$1\n$2')
    .replace(/([^\n])\s(•\s+)/g, '$1\n$2')
    .replace(/([^\n])\s(\d+\.\s+)/g, '$1\n$2')
    .replace(/([^\n])\s(#+\s+)/g, '$1\n\n$2');

  return t.trim();
}

const MarkdownMessage = ({ content }) => {
  const md = useMemo(() => normalizeMarkdown(content), [content]);

  return (
    <div className="text-[15px] md:text-[16px] leading-7 text-gray-100">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-xl font-black text-white mb-3 mt-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-extrabold text-white mb-2 mt-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-white mb-2 mt-4">{children}</h3>,

          p: ({ children }) => <p className="mb-3 last:mb-0 whitespace-pre-wrap">{children}</p>,
          strong: ({ children }) => <strong className="font-extrabold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-200">{children}</em>,

          ul: ({ children }) => <ul className="list-disc pl-6 space-y-1.5 mb-3">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1.5 mb-3">{children}</ol>,
          li: ({ children }) => <li className="whitespace-pre-wrap">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="my-3 pl-4 border-l-4 border-blue-400/60 text-gray-200 bg-black/10 rounded-r-xl py-2">
              {children}
            </blockquote>
          ),

          hr: () => <hr className="my-4 border-white/10" />,

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-blue-300 hover:text-blue-200 underline underline-offset-2 font-semibold"
            >
              {children}
            </a>
          ),

          code: ({ inline, children }) =>
            inline ? (
              <code className="px-1.5 py-0.5 rounded-lg bg-black/30 border border-white/10 text-gray-100 font-mono text-[0.92em]">
                {children}
              </code>
            ) : (
              <pre className="my-3 p-4 rounded-2xl bg-black/35 border border-white/10 overflow-x-auto">
                <code className="text-gray-100 font-mono text-[0.92em] leading-6">{children}</code>
              </pre>
            ),
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
};

const ChatView = ({
  chats, currentChatId, messages,
  input, setInput, loading, error, isSubscribing,
  onSend, onSelectChat, onNewChat, onDeleteChat,
  hasActiveChat,
  isMobileMenuOpen, setIsMobileMenuOpen,
  onBack
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="fixed inset-0 md:static md:h-screen md:flex bg-gray-900 text-white overflow-hidden">
      <div className="flex-1 flex flex-col">

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-lg leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none whitespace-pre-wrap'
                    : 'bg-gray-800/80 text-gray-100 rounded-bl-none border border-white/10'
                }`}
              >
                {msg.role === 'assistant'
                  ? <MarkdownMessage content={msg.content} />
                  : msg.content
                }
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-4 rounded-2xl rounded-bl-none animate-pulse text-gray-400 text-sm">
                Thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="p-3 md:p-4 bg-gray-800 border-t border-gray-700">
          <form onSubmit={(e) => { e.preventDefault(); if (!loading) onSend(); }} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none border border-gray-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-bold"
            >
              🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
