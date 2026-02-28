import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

export default function ChatArea({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 pb-40">
      <div className="max-w-3xl mx-auto space-y-12">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-2">
            <div className="text-sm font-medium text-gray-400 dark:text-gray-500">
              {msg.role === 'user' ? 'You' : 'open'}
            </div>
            
            <div>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {msg.attachments.map((att, i) => (
                    <div key={i} className="w-48 h-48 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                      {att.type === 'image' ? (
                        <img src={att.url} alt="attachment" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                          {att.type}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {msg.imageUrl && (
                <div className="mb-4">
                  <img src={msg.imageUrl} alt="Generated" className="rounded-2xl max-w-full h-auto shadow-md" />
                </div>
              )}
              {msg.error ? (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/50">
                  {msg.error}
                </div>
              ) : (
                <div className={`prose prose-lg dark:prose-invert max-w-none ${msg.role === 'user' ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-gray-100'}`}>
                  {msg.text ? (
                    <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
                  ) : msg.isStreaming ? (
                    msg.isReasoning ? (
                      <div className="flex flex-col gap-3 max-w-sm">
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                          <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-black dark:border-t-white rounded-full animate-spin" />
                          Thinking deeply...
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent w-[200%] animate-[shimmer_1.5s_infinite]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center h-8">
                        <div className="w-2 h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-sm" />
                      </div>
                    )
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
