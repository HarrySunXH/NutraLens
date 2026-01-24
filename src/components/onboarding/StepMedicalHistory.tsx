"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, X, Plus } from "lucide-react";
import { HealthProfile } from "@/types/health-profile";

interface StepMedicalHistoryProps {
  profile: HealthProfile;
  onUpdate: (updates: Partial<HealthProfile>) => void;
}

interface ChipInputProps {
  label: string;
  description: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}

function ChipInput({ label, description, values, onChange, placeholder }: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addValue = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      onChange([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addValue();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <p className="text-xs text-gray-500">{description}</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
        />
        <button
          onClick={addValue}
          className="px-3 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((value, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm"
            >
              {value}
              <button
                onClick={() => removeValue(index)}
                className="p-0.5 hover:bg-emerald-200 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StepMedicalHistory({ profile, onUpdate }: StepMedicalHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>
        <p className="text-gray-600 mt-2">
          This helps us avoid recommending supplements that may be contraindicated
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Leave empty if you have no known conditions. This information helps ensure safe recommendations.
      </div>

      <ChipInput
        label="Liver Conditions"
        description="e.g., fatty liver, hepatitis, cirrhosis"
        values={profile.liverConditions}
        onChange={(values) => onUpdate({ liverConditions: values })}
        placeholder="Type condition and press Enter"
      />

      <ChipInput
        label="Kidney Conditions"
        description="e.g., chronic kidney disease, kidney stones"
        values={profile.kidneyConditions}
        onChange={(values) => onUpdate({ kidneyConditions: values })}
        placeholder="Type condition and press Enter"
      />

      <ChipInput
        label="Digestive Conditions"
        description="e.g., IBS, Crohn's disease, GERD, celiac"
        values={profile.digestiveConditions}
        onChange={(values) => onUpdate({ digestiveConditions: values })}
        placeholder="Type condition and press Enter"
      />

      <ChipInput
        label="Other Chronic Conditions"
        description="e.g., diabetes, hypertension, thyroid disorders"
        values={profile.otherConditions}
        onChange={(values) => onUpdate({ otherConditions: values })}
        placeholder="Type condition and press Enter"
      />
    </motion.div>
  );
}
