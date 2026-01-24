"use client";

import { motion } from "framer-motion";
import { Brain, User, Sparkles, ChevronRight, Check } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenProfile: () => void;
  isProfileComplete: boolean;
}

const questions = [
  "What supplements should I take for better energy?",
  "Can you check my supplements for interactions?",
  "What is the best time to take my vitamins?",
  "How can I optimize my current supplement stack?",
];

export default function SuggestedPrompts({ 
  onSelectPrompt, 
  onOpenProfile,
  isProfileComplete 
}: SuggestedPromptsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4"
    >
      {/* Welcome Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg mb-5"
      >
        <Brain className="w-8 h-8 text-white" />
      </motion.div>

      {/* Welcome Text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-gray-900 mb-2"
      >
        NutraLens AI Assistant
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 mb-8"
      >
        Your personal health assistant for supplement guidance
      </motion.p>

      {/* Health Profile Card */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenProfile}
        className={`w-full max-w-md mb-8 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
          isProfileComplete
            ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
            : "border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 hover:border-emerald-500 shadow-lg shadow-emerald-100"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${
            isProfileComplete 
              ? "bg-emerald-100" 
              : "bg-gradient-to-br from-emerald-500 to-teal-500"
          }`}>
            {isProfileComplete ? (
              <Check className="w-6 h-6 text-emerald-600" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${
                isProfileComplete ? "text-emerald-700" : "text-gray-900"
              }`}>
                {isProfileComplete ? "Health Profile Complete" : "Fill Your Health Profile"}
              </h3>
              {!isProfileComplete && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {isProfileComplete 
                ? "Your profile is helping us personalize recommendations. Click to update."
                : "Get personalized supplement recommendations based on your health data, goals, and lab results."
              }
            </p>
            <div className="flex items-center text-sm font-medium text-emerald-600">
              {isProfileComplete ? "Edit Profile" : "Fill Profile"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          {!isProfileComplete && (
            <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          )}
        </div>
      </motion.button>

      {/* Questions */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-gray-400 mb-4"
      >
        Or start with a question
      </motion.p>
      <div className="flex flex-col items-center gap-3 w-full max-w-md">
        {questions.map((question, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + index * 0.08 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPrompt(question)}
            className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200 text-sm text-gray-700 hover:text-emerald-700 cursor-pointer"
          >
            {question}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
