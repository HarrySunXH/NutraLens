"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Activity, Target, FlaskConical, Pill, Trash2 } from "lucide-react";
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
      setLocalProfile(profile);
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

function MedicalTab({ profile, onUpdate }: TabProps) {
  const updateConditions = (key: keyof HealthProfile, value: string) => {
    const conditions = value.split(",").map((s) => s.trim()).filter(Boolean);
    onUpdate({ ...profile, [key]: conditions });
  };

  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-gray-500 mb-4">Enter conditions separated by commas</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Liver Conditions</label>
        <input
          type="text"
          value={profile.liverConditions.join(", ")}
          onChange={(e) => updateConditions("liverConditions", e.target.value)}
          placeholder="e.g., fatty liver, hepatitis"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kidney Conditions</label>
        <input
          type="text"
          value={profile.kidneyConditions.join(", ")}
          onChange={(e) => updateConditions("kidneyConditions", e.target.value)}
          placeholder="e.g., kidney stones, CKD"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Digestive Conditions</label>
        <input
          type="text"
          value={profile.digestiveConditions.join(", ")}
          onChange={(e) => updateConditions("digestiveConditions", e.target.value)}
          placeholder="e.g., IBS, GERD"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Other Conditions</label>
        <input
          type="text"
          value={profile.otherConditions.join(", ")}
          onChange={(e) => updateConditions("otherConditions", e.target.value)}
          placeholder="e.g., diabetes, hypertension"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
      </div>
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
