"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingDown,
  Utensils,
  Zap,
  Heart,
  Dumbbell,
  Brain,
  Shield,
  Target,
  Plus,
  X,
} from "lucide-react";
import { HealthProfile, HealthGoals } from "@/types/health-profile";
import { LucideIcon } from "lucide-react";

interface StepHealthGoalsProps {
  profile: HealthProfile;
  onUpdate: (updates: Partial<HealthProfile>) => void;
}

interface GoalOption {
  key: keyof HealthGoals;
  label: string;
  description: string;
  icon: LucideIcon;
}

const goalOptions: GoalOption[] = [
  {
    key: "weightManagement",
    label: "Weight Management",
    description: "Lose weight, reduce body fat, and improve body composition",
    icon: TrendingDown,
  },
  {
    key: "appetiteControl",
    label: "Appetite Control",
    description: "Reduce cravings, manage hunger, and support calorie deficit",
    icon: Utensils,
  },
  {
    key: "fitness",
    label: "General Fitness",
    description: "Improve overall physical fitness and endurance",
    icon: Heart,
  },
  {
    key: "muscleMass",
    label: "Muscle Mass",
    description: "Build and maintain lean muscle tissue",
    icon: Dumbbell,
  },
  {
    key: "strength",
    label: "Strength",
    description: "Increase physical strength and power",
    icon: Zap,
  },
  {
    key: "mentalPerformance",
    label: "Mental Performance",
    description: "Enhance focus, memory, and cognitive function",
    icon: Brain,
  },
  {
    key: "longevity",
    label: "Longevity",
    description: "Support healthy aging and lifespan",
    icon: Shield,
  },
  {
    key: "painMitigation",
    label: "Pain Mitigation",
    description: "Reduce chronic pain and inflammation",
    icon: Target,
  },
];

export default function StepHealthGoals({ profile, onUpdate }: StepHealthGoalsProps) {
  const [customInput, setCustomInput] = useState("");

  const toggleGoal = (key: keyof HealthGoals) => {
    onUpdate({
      goals: {
        ...profile.goals,
        [key]: !profile.goals[key],
      },
    });
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const existing = profile.customGoals || [];
    if (existing.includes(trimmed)) return;
    onUpdate({ customGoals: [...existing, trimmed] });
    setCustomInput("");
  };

  const handleRemoveCustom = (goal: string) => {
    onUpdate({ customGoals: (profile.customGoals || []).filter((g) => g !== goal) });
  };

  const selectedCount =
    goalOptions.filter((goal) => profile.goals[goal.key]).length +
    (profile.customGoals?.length ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Health Goals</h2>
        <p className="text-gray-600 mt-2">
          Select all that apply to personalize your recommendations
        </p>
        <p className="text-sm text-emerald-600 mt-1">
          {selectedCount} goal{selectedCount !== 1 ? "s" : ""} selected
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {goalOptions.map((goal) => {
          const Icon = goal.icon;
          const isSelected = profile.goals[goal.key];

          return (
            <motion.button
              key={goal.key}
              onClick={() => toggleGoal(goal.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    isSelected
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-sm ${
                      isSelected ? "text-emerald-700" : "text-gray-900"
                    }`}
                  >
                    {goal.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {goal.description}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom goal input */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Don&apos;t see your goal? Add your own
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            placeholder="e.g. Blood sugar control, Medication support..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
          />
          <button
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        {(profile.customGoals?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {(profile.customGoals || []).map((goal) => (
              <span
                key={goal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-sm font-medium"
              >
                {goal}
                <button
                  onClick={() => handleRemoveCustom(goal)}
                  className="hover:text-teal-900 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
