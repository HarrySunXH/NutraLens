"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, User } from "lucide-react";
import MessageContent from "./MessageContent";
import Image from "next/image";

export interface SupplementProduct {
  title: string;
  url: string;
  description?: string;
  source?: string;
  price?: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  file?: {
    name: string;
    preview?: string;
  };
  products?: SupplementProduct[];
  answeredQuestion?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  isStreaming?: boolean;
  onQuestionAnswer?: (messageId: string, answer: string) => void;
}

export default function ChatMessages({ messages, isTyping, isStreaming = false, onQuestionAnswer }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef<number>(0);

  // Auto-scroll to bottom - throttled during streaming to prevent jitter
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollRef.current;
    
    // During streaming, only scroll every 500ms to reduce jitter
    // When not streaming, scroll immediately
    if (!isStreaming || timeSinceLastScroll > 500) {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
        
        // Only auto-scroll if user is near the bottom
        if (isNearBottom && messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          lastScrollRef.current = now;
        }
      }
    }
  }, [messages, isTyping, isStreaming]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scroll-smooth"
    >
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        {/* Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {message.role === "assistant" ? (
                // AI Message - Clean like ChatGPT
                <div className="flex items-start gap-4">
                  {/* AI Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  {/* Message Content - hide products while streaming */}
                  <div className="flex-1 min-w-0 pt-1">
                    <MessageContent 
                      content={message.content} 
                      products={message.products} 
                      isStreaming={isStreaming && message.id === messages[messages.length - 1]?.id}
                      onQuestionAnswer={onQuestionAnswer ? (answer) => onQuestionAnswer(message.id, answer) : undefined}
                      answeredQuestion={message.answeredQuestion}
                    />
                  </div>
                </div>
              ) : (
                // User Message
                <div>
                  {/* Attached File */}
                  {message.file && (
                    <div className="mb-2 flex justify-end pr-12">
                      <div className="bg-gray-100 rounded-xl p-2 inline-flex items-center gap-2">
                        {message.file.preview ? (
                          <Image
                            src={message.file.preview}
                            alt={message.file.name}
                            width={80}
                            height={80}
                            unoptimized
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-600">
                            {message.file.name}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    {/* Message Content */}
                    <div className="flex-1 min-w-0 flex justify-end">
                      <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[85%]">
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <div className="inline-flex gap-1.5 py-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
