import { useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";

function normalizeMarkdown(text) {
  if (!text) return "";
  let t = String(text).replace(/\r\n/g, "\n");

  t = t
    .replace(/([^\n])\s(\*\s+)/g, "$1\n$2")
    .replace(/([^\n])\s(-\s+)/g, "$1\n$2")
    .replace(/([^\n])\s(•\s+)/g, "$1\n$2")
    .replace(/([^\n])\s(\d+\.\s+)/g, "$1\n$2")
    .replace(/([^\n])\s(#+\s+)/g, "$1\n\n$2");

  return t.trim();
}

const MarkdownMessage = ({ content }) => {
  const md = useMemo(() => normalizeMarkdown(content), [content]);

  return (
    <div className="text-[15px] md:text-[16px] leading-7 text-gray-100">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0 whitespace-pre-wrap">{children}</p>,
          strong: ({ children }) => <strong className="font-extrabold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-200">{children}</em>,

          ul: ({ children }) => (
            <ul className="pl-5 mb-4 space-y-2 list-disc marker:text-blue-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="pl-5 mb-4 space-y-2 list-decimal marker:text-blue-400">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed text-gray-100">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="my-3 pl-4 border-l-4 border-blue-400/60 text-gray-200 bg-black/10 rounded-r-xl py-2">
              {children}
            </blockquote>
          ),

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
  chats,
  currentChat,
  messages,

  input,
  onInputChange,

  isLoading,
  error,
  isSubscribing,

  onSend,
  onSelectChat,
  onNewChat,
  onDelete,

  isMobileMenuOpen,
  setIsMobileMenuOpen,

  onBack,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const hasActiveChat = currentChat && messages && messages.length > 0;
  const currentChatId = currentChat?.id;

  return (
    <div className="fixed inset-0 md:static md:h-screen md:flex md:flex-row bg-gray-900 text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-16 bg-gray-800 border-b border-gray-700 z-40 flex items-center justify-between px-4 shadow-md md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="cursor-pointer p-2 -ml-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition"
            title="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="font-bold text-blue-400">Buddy</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="cursor-pointer bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm border border-gray-600 active:scale-95 transition font-medium"
        >
          {isMobileMenuOpen ? "Close" : "History"}
        </button>
      </div>

      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-[80%] max-w-[300px] bg-gray-800 border-r border-gray-700 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-80 md:flex md:flex-col md:z-0 md:shadow-none
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 mt-16 md:mt-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              onNewChat();
              setIsMobileMenuOpen(false);
            }}
            className="cursor-pointer w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition shadow-lg border border-blue-400 active:scale-95"
          >
            <span className="text-xl">+</span> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {isSubscribing && (
            <div className="text-blue-400 text-center text-xs py-2 animate-pulse">
              Syncing chat history...
            </div>
          )}

          {chats && chats.length === 0 && !isSubscribing && (
            <div className="text-gray-500 text-center text-sm mt-10 px-4">
              No history yet. Start a new chat!
            </div>
          )}

          {chats && chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                onSelectChat(chat.id);
                setIsMobileMenuOpen(false);
              }}
              className={`cursor-pointer group flex items-center justify-between p-3 rounded-lg transition border ${
                chat.id === currentChatId ? "bg-gray-700 border-blue-500/50" : "border-transparent hover:bg-gray-700/50"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-lg">💬</span>
                <span className="text-sm text-gray-300 truncate font-medium w-full">
                  {chat.title || "New Conversation"}
                </span>
              </div>

              <button
                onClick={(e) => onDelete(e, chat.id)}
                className="cursor-pointer md:opacity-0 md:group-hover:opacity-100 text-gray-500 hover:text-red-400 transition px-2"
                title="Delete chat"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="absolute inset-0 top-16 md:static md:top-0 md:flex-1 flex flex-col bg-gray-900 z-0">
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>Failed to send message. Please try again.</span>
          </div>
        )}

        {!hasActiveChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center animate-fade-in">
            <div className="text-6xl mb-4 bg-gray-800 p-6 rounded-full shadow-lg">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-2">Lumen AI Buddy</h2>
            <p className="max-w-md text-sm">
              I can help you with Math, Science, or English! Just type your question below to start.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-md leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none whitespace-pre-wrap"
                      : "bg-gray-800/80 text-gray-100 rounded-bl-none border border-white/10"
                  }`}
                >
                  {msg.role === "assistant" ? <MarkdownMessage content={msg.content} /> : msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/80 border border-white/10 p-4 rounded-2xl rounded-bl-none animate-pulse text-gray-300 text-sm flex gap-2 items-center">
                  <span>Thinking</span>
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

        <div className="p-3 md:p-4 bg-gray-800/90 backdrop-blur-md border-t border-gray-700 z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading && input && input.trim()) {
                onSend();
              }
            }}
            className="relative max-w-4xl mx-auto flex gap-2"
          >
            <input
              type="text"
              value={input || ''}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 shadow-inner text-sm md:text-base disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input || !input.trim()}
              className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 md:px-6 rounded-xl transition disabled:opacity-50 font-bold shadow-lg flex items-center justify-center active:scale-95"
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
