"use client";

import { motion } from "framer-motion";
import { Brain, Menu, Sparkles, PanelLeftClose, PanelLeft } from "lucide-react";

interface ChatHeaderProps {
  isTyping: boolean;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function ChatHeader({
  isTyping,
  onToggleSidebar,
  isSidebarOpen,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="w-5 h-5 text-gray-600" />
        ) : (
          <PanelLeft className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* AI Assistant Info - Centered */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={isTyping ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
          className="relative"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {/* Status Indicator */}
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
              isTyping ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
        </motion.div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">NutraLens AI</h2>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xs text-gray-500">
            {isTyping ? (
              <span className="text-amber-600">Thinking...</span>
            ) : (
              <span className="text-emerald-600">Online</span>
            )}
          </p>
        </div>
      </div>

      {/* Spacer for alignment */}
      <div className="w-9" />
    </div>
  );
}
