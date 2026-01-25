"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, X, Plus, ChevronDown } from "lucide-react";
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
  options: string[];
}

// Common medical conditions by category
const LIVER_CONDITIONS = [
  "Fatty liver disease",
  "Hepatitis A",
  "Hepatitis B",
  "Hepatitis C",
  "Cirrhosis",
  "Liver fibrosis",
  "Non-alcoholic fatty liver disease (NAFLD)",
  "Alcoholic liver disease",
  "Autoimmune hepatitis",
  "Primary biliary cholangitis",
  "Wilson's disease",
  "Hemochromatosis",
];

const KIDNEY_CONDITIONS = [
  "Chronic kidney disease (CKD)",
  "Kidney stones",
  "Polycystic kidney disease",
  "Glomerulonephritis",
  "Nephrotic syndrome",
  "Acute kidney injury",
  "Kidney infection (pyelonephritis)",
  "Diabetic nephropathy",
  "Hypertensive nephropathy",
  "IgA nephropathy",
];

const DIGESTIVE_CONDITIONS = [
  "Irritable bowel syndrome (IBS)",
  "Crohn's disease",
  "Ulcerative colitis",
  "GERD (Gastroesophageal reflux disease)",
  "Celiac disease",
  "Lactose intolerance",
  "Gastritis",
  "Peptic ulcer disease",
  "Diverticulitis",
  "Inflammatory bowel disease (IBD)",
  "Constipation",
  "Diarrhea",
  "Gastroparesis",
  "Small intestinal bacterial overgrowth (SIBO)",
];

const OTHER_CONDITIONS = [
  "Type 1 diabetes",
  "Type 2 diabetes",
  "Prediabetes",
  "Hypertension (high blood pressure)",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Hashimoto's thyroiditis",
  "Graves' disease",
  "Heart disease",
  "Arrhythmia",
  "Asthma",
  "COPD",
  "Osteoporosis",
  "Osteoarthritis",
  "Rheumatoid arthritis",
  "Lupus",
  "Multiple sclerosis",
  "Epilepsy",
  "Migraine",
  "Depression",
  "Anxiety",
  "Bipolar disorder",
  "ADHD",
  "Anemia",
  "Hemophilia",
  "Autoimmune disease",
];

function ChipInput({ label, description, values, onChange, placeholder, options }: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInputDropdownOpen, setIsInputDropdownOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (inputDropdownRef.current && !inputDropdownRef.current.contains(event.target as Node)) {
        setIsInputDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addValue = (value?: string) => {
    const valueToAdd = (value || inputValue).trim();
    if (valueToAdd && !values.includes(valueToAdd)) {
      onChange([...values, valueToAdd]);
      setInputValue("");
      setIsDropdownOpen(false);
      setIsInputDropdownOpen(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Filter options based on input
    if (value.trim()) {
      const filtered = options.filter(opt => 
        opt.toLowerCase().includes(value.toLowerCase()) && 
        !values.includes(opt)
      );
      setFilteredOptions(filtered);
      setIsInputDropdownOpen(filtered.length > 0);
    } else {
      setFilteredOptions(options.filter(opt => !values.includes(opt)));
      setIsInputDropdownOpen(false);
    }
  };

  const handleSelectOption = (option: string) => {
    addValue(option);
  };

  const availableOptions = options.filter(opt => !values.includes(opt));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <p className="text-xs text-gray-500">{description}</p>
      
      {/* Dropdown Select */}
      {availableOptions.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm flex items-center justify-between hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer"
          >
            <span>Select from common conditions</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {availableOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors first:rounded-t-xl last:rounded-b-xl cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Custom Input */}
      <div className="relative flex gap-2" ref={inputDropdownRef}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim() && filteredOptions.length > 0) {
              setIsInputDropdownOpen(true);
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
        />
        <button
          onClick={() => addValue()}
          disabled={!inputValue.trim()}
          className="px-3 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Dropdown suggestions while typing */}
        {isInputDropdownOpen && inputValue.trim() && filteredOptions.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-12 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectOption(option)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors first:rounded-t-xl last:rounded-b-xl cursor-pointer"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Values as Chips */}
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
                className="p-0.5 hover:bg-emerald-200 rounded-full transition-colors cursor-pointer"
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
        options={LIVER_CONDITIONS}
      />

      <ChipInput
        label="Kidney Conditions"
        description="e.g., chronic kidney disease, kidney stones"
        values={profile.kidneyConditions}
        onChange={(values) => onUpdate({ kidneyConditions: values })}
        placeholder="Type condition and press Enter"
        options={KIDNEY_CONDITIONS}
      />

      <ChipInput
        label="Digestive Conditions"
        description="e.g., IBS, Crohn's disease, GERD, celiac"
        values={profile.digestiveConditions}
        onChange={(values) => onUpdate({ digestiveConditions: values })}
        placeholder="Type condition and press Enter"
        options={DIGESTIVE_CONDITIONS}
      />

      <ChipInput
        label="Other Chronic Conditions"
        description="e.g., diabetes, hypertension, thyroid disorders"
        values={profile.otherConditions}
        onChange={(values) => onUpdate({ otherConditions: values })}
        placeholder="Type condition and press Enter"
        options={OTHER_CONDITIONS}
      />
    </motion.div>
  );
}
