"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, X, Image as ImageIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string, file?: File | null) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() || attachedFile) {
      onSendMessage(message.trim(), attachedFile);
      setMessage("");
      setAttachedFile(null);
      setFilePreview(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 pb-6">
      <div className="max-w-3xl mx-auto">
        {/* Floating Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-3"
        >
          {/* File Preview */}
          {attachedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 flex items-center gap-3 p-3 rounded-xl bg-gray-50"
            >
              {filePreview ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-6 h-6 text-emerald-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(attachedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </motion.div>
          )}

          {/* Input Area */}
          <div className="flex items-center gap-2">
            {/* File Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="chat-file-input"
            />
            <motion.label
              htmlFor="chat-file-input"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-10 h-10 rounded-full cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </motion.label>

            {/* Text Input */}
            <div className="flex-1 relative flex items-center">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about supplements..."
                disabled={disabled}
                rows={1}
                className="w-full px-2 py-2 bg-transparent resize-none focus:outline-none transition-all placeholder-gray-400 text-gray-900 leading-6"
                style={{ minHeight: "40px", maxHeight: "150px" }}
              />
            </div>

            {/* Send Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={disabled || (!message.trim() && !attachedFile)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
                message.trim() || attachedFile
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Hint */}
        <p className="text-sm text-gray-500 mt-3 text-center">
          Press <span className="font-medium text-gray-600">Enter</span> to send, <span className="font-medium text-gray-600">Shift + Enter</span> for new line
        </p>
      </div>
    </div>
  );
}
