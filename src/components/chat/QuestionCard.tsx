"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Send, Check } from "lucide-react";
import { ParsedQuestion } from "@/utils/parseQuestions";

interface QuestionCardProps {
  question: ParsedQuestion;
  onAnswer: (answer: string) => void;
  answered?: boolean;
  selectedAnswer?: string;
}

export default function QuestionCard({
  question,
  onAnswer,
  answered = false,
  selectedAnswer,
}: QuestionCardProps) {
  const [customInput, setCustomInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
    setCustomInput("");
  };

  const handleSubmit = () => {
    if (answered) return;
    
    const answer = customInput.trim() || selectedOption;
    if (answer) {
      onAnswer(answer);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (answered) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
      >
        <div className="flex items-center gap-2 text-emerald-700">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Answered: {selectedAnswer}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm"
    >
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{question.text}</p>
          <p className="text-xs text-gray-500 mt-1">
            Select an option or type your own answer
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-2 mb-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`px-4 py-2 text-sm rounded-full border transition-all cursor-pointer ${
              selectedOption === option
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => {
            setCustomInput(e.target.value);
            if (e.target.value) setSelectedOption(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Or type your own answer..."
          className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
        <button
          onClick={handleSubmit}
          disabled={!selectedOption && !customInput.trim()}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all cursor-pointer ${
            selectedOption || customInput.trim()
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </motion.div>
  );
}
