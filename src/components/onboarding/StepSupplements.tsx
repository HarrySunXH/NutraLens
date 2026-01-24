"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, X, Plus } from "lucide-react";
import { HealthProfile } from "@/types/health-profile";

interface StepSupplementsProps {
  profile: HealthProfile;
  onUpdate: (updates: Partial<HealthProfile>) => void;
}

const commonSupplements = [
  "Vitamin D",
  "Vitamin B12",
  "Omega-3 Fish Oil",
  "Magnesium",
  "Zinc",
  "Vitamin C",
  "Multivitamin",
  "Creatine",
  "Protein Powder",
  "Probiotics",
  "Iron",
  "Calcium",
  "Ashwagandha",
  "Turmeric/Curcumin",
  "CoQ10",
  "Melatonin",
];

export default function StepSupplements({ profile, onUpdate }: StepSupplementsProps) {
  const [inputValue, setInputValue] = useState("");

  const addSupplement = (supplement: string) => {
    const trimmed = supplement.trim();
    if (trimmed && !profile.currentSupplements.includes(trimmed)) {
      onUpdate({
        currentSupplements: [...profile.currentSupplements, trimmed],
      });
    }
    setInputValue("");
  };

  const removeSupplement = (index: number) => {
    onUpdate({
      currentSupplements: profile.currentSupplements.filter((_, i) => i !== index),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSupplement(inputValue);
    }
  };

  const availableQuickAdd = commonSupplements.filter(
    (s) => !profile.currentSupplements.includes(s)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Pill className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Current Supplements</h2>
        <p className="text-gray-600 mt-2">
          Tell us what you&apos;re currently taking so we can check for interactions
        </p>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Add Supplement
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type supplement name and press Enter"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
          <button
            onClick={() => addSupplement(inputValue)}
            className="px-4 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Current Supplements */}
      {profile.currentSupplements.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Your Supplements ({profile.currentSupplements.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {profile.currentSupplements.map((supplement, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700"
              >
                <Pill className="w-4 h-4" />
                {supplement}
                <button
                  onClick={() => removeSupplement(index)}
                  className="p-0.5 hover:bg-emerald-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Add */}
      {availableQuickAdd.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Quick Add Common Supplements
          </label>
          <div className="flex flex-wrap gap-2">
            {availableQuickAdd.slice(0, 8).map((supplement) => (
              <button
                key={supplement}
                onClick={() => addSupplement(supplement)}
                className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 text-sm hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                + {supplement}
              </button>
            ))}
          </div>
        </div>
      )}

      {profile.currentSupplements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No supplements added yet</p>
          <p className="text-sm">Add your current supplements or skip if you&apos;re not taking any</p>
        </div>
      )}
    </motion.div>
  );
}
