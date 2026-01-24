"use client";

import { motion } from "framer-motion";
import { User, Calendar, Users } from "lucide-react";
import { HealthProfile, SexAtBirth } from "@/types/health-profile";

interface StepBasicInfoProps {
  profile: HealthProfile;
  onUpdate: (updates: Partial<HealthProfile>) => void;
}

export default function StepBasicInfo({ profile, onUpdate }: StepBasicInfoProps) {
  const sexOptions: { value: SexAtBirth; label: string }[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "intersex", label: "Intersex" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-600 mt-2">
          Help us personalize your supplement recommendations
        </p>
      </div>

      {/* Age */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Age
        </label>
        <input
          type="number"
          min="1"
          max="120"
          value={profile.age || ""}
          onChange={(e) => onUpdate({ age: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="Enter your age"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
        />
      </div>

      {/* Sex at Birth */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Users className="w-4 h-4 text-emerald-600" />
          Sex Assigned at Birth
        </label>
        <p className="text-xs text-gray-500">
          This helps us provide accurate recommendations based on biological factors
        </p>
        <div className="grid grid-cols-2 gap-3">
          {sexOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ sexAtBirth: option.value })}
              className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                profile.sexAtBirth === option.value
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Identity */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <User className="w-4 h-4 text-emerald-600" />
          Gender Identity (Optional)
        </label>
        <input
          type="text"
          value={profile.genderIdentity || ""}
          onChange={(e) => onUpdate({ genderIdentity: e.target.value || null })}
          placeholder="How do you identify?"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
        />
      </div>
    </motion.div>
  );
}
