"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Activity, Target, FlaskConical, Pill, Trash2, Plus, ChevronDown } from "lucide-react";
import { useHealthProfile } from "@/context/HealthProfileContext";
import { HealthProfile, HealthGoals, labReferenceRanges } from "@/types/health-profile";

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "basic" | "medical" | "goals" | "labs" | "supplements";

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "medical", label: "Medical", icon: Activity },
  { id: "goals", label: "Goals", icon: Target },
  { id: "labs", label: "Lab Results", icon: FlaskConical },
  { id: "supplements", label: "Supplements", icon: Pill },
];

export default function ProfileEditor({ isOpen, onClose }: ProfileEditorProps) {
  const { profile, updateProfile, clearProfile } = useHealthProfile();
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [localProfile, setLocalProfile] = useState<HealthProfile>(profile);

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => setLocalProfile(profile));
    }
  }, [isOpen, profile]);

  const handleSave = () => {
    updateProfile(localProfile);
    onClose();
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all your health profile data?")) {
      clearProfile();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Health Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {activeTab === "basic" && (
              <BasicInfoTab profile={localProfile} onUpdate={setLocalProfile} />
            )}
            {activeTab === "medical" && (
              <MedicalTab profile={localProfile} onUpdate={setLocalProfile} />
            )}
            {activeTab === "goals" && (
              <GoalsTab profile={localProfile} onUpdate={setLocalProfile} />
            )}
            {activeTab === "labs" && (
              <LabsTab profile={localProfile} onUpdate={setLocalProfile} />
            )}
            {activeTab === "supplements" && (
              <SupplementsTab profile={localProfile} onUpdate={setLocalProfile} />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Tab Components
interface TabProps {
  profile: HealthProfile;
  onUpdate: (profile: HealthProfile) => void;
}

function BasicInfoTab({ profile, onUpdate }: TabProps) {
  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input
          type="number"
          value={profile.age || ""}
          onChange={(e) => onUpdate({ ...profile, age: e.target.value ? parseInt(e.target.value) : null })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sex at Birth</label>
        <select
          value={profile.sexAtBirth || ""}
          onChange={(e) => onUpdate({ ...profile, sexAtBirth: e.target.value as HealthProfile["sexAtBirth"] })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        >
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="intersex">Intersex</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender Identity</label>
        <input
          type="text"
          value={profile.genderIdentity || ""}
          onChange={(e) => onUpdate({ ...profile, genderIdentity: e.target.value || null })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
      </div>
    </div>
  );
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

interface ChipInputProps {
  label: string;
  description: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  options: string[];
}

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

function MedicalTab({ profile, onUpdate }: TabProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Leave empty if you have no known conditions. This information helps ensure safe recommendations.
      </div>

      <ChipInput
        label="Liver Conditions"
        description="e.g., fatty liver, hepatitis, cirrhosis"
        values={profile.liverConditions}
        onChange={(values) => onUpdate({ ...profile, liverConditions: values })}
        placeholder="Type condition and press Enter"
        options={LIVER_CONDITIONS}
      />

      <ChipInput
        label="Kidney Conditions"
        description="e.g., chronic kidney disease, kidney stones"
        values={profile.kidneyConditions}
        onChange={(values) => onUpdate({ ...profile, kidneyConditions: values })}
        placeholder="Type condition and press Enter"
        options={KIDNEY_CONDITIONS}
      />

      <ChipInput
        label="Digestive Conditions"
        description="e.g., IBS, Crohn's disease, GERD, celiac"
        values={profile.digestiveConditions}
        onChange={(values) => onUpdate({ ...profile, digestiveConditions: values })}
        placeholder="Type condition and press Enter"
        options={DIGESTIVE_CONDITIONS}
      />

      <ChipInput
        label="Other Chronic Conditions"
        description="e.g., diabetes, hypertension, thyroid disorders"
        values={profile.otherConditions}
        onChange={(values) => onUpdate({ ...profile, otherConditions: values })}
        placeholder="Type condition and press Enter"
        options={OTHER_CONDITIONS}
      />
    </div>
  );
}

function GoalsTab({ profile, onUpdate }: TabProps) {
  const toggleGoal = (key: keyof HealthGoals) => {
    onUpdate({
      ...profile,
      goals: { ...profile.goals, [key]: !profile.goals[key] },
    });
  };

  const goals: { key: keyof HealthGoals; label: string }[] = [
    { key: "fitness", label: "General Fitness" },
    { key: "muscleMass", label: "Muscle Mass" },
    { key: "strength", label: "Strength" },
    { key: "mentalPerformance", label: "Mental Performance" },
    { key: "longevity", label: "Longevity" },
    { key: "painMitigation", label: "Pain Mitigation" },
  ];

  return (
    <div className="space-y-3 max-w-md">
      {goals.map((goal) => (
        <label
          key={goal.key}
          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <input
            type="checkbox"
            checked={profile.goals[goal.key]}
            onChange={() => toggleGoal(goal.key)}
            className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="font-medium text-gray-700">{goal.label}</span>
        </label>
      ))}
    </div>
  );
}

function LabsTab({ profile, onUpdate }: TabProps) {
  const updateLab = (category: "hormones" | "vitamins" | "generalHealth", key: string, value: string) => {
    onUpdate({
      ...profile,
      labData: {
        ...profile.labData,
        [category]: {
          ...profile.labData[category],
          [key]: value ? parseFloat(value) : null,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Hormones</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(labReferenceRanges.hormones).slice(0, 4).map(([key, info]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="number"
                step="0.1"
                value={(profile.labData.hormones as Record<string, number | null | undefined>)[key] ?? ""}
                onChange={(e) => updateLab("hormones", key, e.target.value)}
                placeholder={info.unit}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Vitamins</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(labReferenceRanges.vitamins).slice(0, 4).map(([key, info]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="number"
                step="0.1"
                value={(profile.labData.vitamins as Record<string, number | null | undefined>)[key] ?? ""}
                onChange={(e) => updateLab("vitamins", key, e.target.value)}
                placeholder={info.unit}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">General Health</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(labReferenceRanges.generalHealth).slice(0, 4).map(([key, info]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="number"
                step="0.1"
                value={(profile.labData.generalHealth as Record<string, number | null | undefined>)[key] ?? ""}
                onChange={(e) => updateLab("generalHealth", key, e.target.value)}
                placeholder={info.unit}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SupplementsTab({ profile, onUpdate }: TabProps) {
  const [input, setInput] = useState("");

  const addSupplement = () => {
    if (input.trim() && !profile.currentSupplements.includes(input.trim())) {
      onUpdate({
        ...profile,
        currentSupplements: [...profile.currentSupplements, input.trim()],
      });
      setInput("");
    }
  };

  const removeSupplement = (index: number) => {
    onUpdate({
      ...profile,
      currentSupplements: profile.currentSupplements.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSupplement())}
          placeholder="Add a supplement..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
        <button
          onClick={addSupplement}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {profile.currentSupplements.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm"
          >
            {s}
            <button
              onClick={() => removeSupplement(i)}
              className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
      {profile.currentSupplements.length === 0 && (
        <p className="text-gray-500 text-sm">No supplements added yet</p>
      )}
    </div>
  );
}
