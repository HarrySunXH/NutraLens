"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ChevronDown, ChevronUp } from "lucide-react";
import { HealthProfile, labReferenceRanges } from "@/types/health-profile";

interface StepLabResultsProps {
  profile: HealthProfile;
  onUpdate: (updates: Partial<HealthProfile>) => void;
}

interface LabInputProps {
  label: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  unit: string;
  reference: string;
}

function LabInput({ label, value, onChange, unit, reference }: LabInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="0.1"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
          placeholder="Enter value"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
        />
        <span className="text-sm text-gray-500 w-16">{unit}</span>
      </div>
      <p className="text-xs text-gray-400">Reference: {reference}</p>
    </div>
  );
}

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({ title, isOpen, onToggle, children }: AccordionSectionProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StepLabResults({ profile, onUpdate }: StepLabResultsProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const updateHormone = (key: string, value: number | null) => {
    onUpdate({
      labData: {
        ...profile.labData,
        hormones: {
          ...profile.labData.hormones,
          [key]: value,
        },
      },
    });
  };

  const updateVitamin = (key: string, value: number | null) => {
    onUpdate({
      labData: {
        ...profile.labData,
        vitamins: {
          ...profile.labData.vitamins,
          [key]: value,
        },
      },
    });
  };

  const updateGeneralHealth = (key: string, value: number | null) => {
    onUpdate({
      labData: {
        ...profile.labData,
        generalHealth: {
          ...profile.labData.generalHealth,
          [key]: value,
        },
      },
    });
  };

  const refs = labReferenceRanges;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FlaskConical className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Lab Results</h2>
        <p className="text-gray-600 mt-2">
          Optional: Enter your recent lab values for personalized insights
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>All fields are optional.</strong> If you have recent blood work, adding these values helps us provide more accurate recommendations.
      </div>

      <div className="space-y-4">
        <AccordionSection
          title="Hormones"
          isOpen={openSections.includes("hormones")}
          onToggle={() => toggleSection("hormones")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabInput
              label="Testosterone"
              value={profile.labData.hormones.testosterone}
              onChange={(v) => updateHormone("testosterone", v)}
              unit={refs.hormones.testosterone.unit}
              reference={profile.sexAtBirth === "female" ? refs.hormones.testosterone.femaleRange : refs.hormones.testosterone.maleRange}
            />
            <LabInput
              label="Estrogen"
              value={profile.labData.hormones.estrogen}
              onChange={(v) => updateHormone("estrogen", v)}
              unit={refs.hormones.estrogen.unit}
              reference={profile.sexAtBirth === "male" ? refs.hormones.estrogen.maleRange : refs.hormones.estrogen.femaleRange}
            />
            <LabInput
              label="Cortisol"
              value={profile.labData.hormones.cortisol}
              onChange={(v) => updateHormone("cortisol", v)}
              unit={refs.hormones.cortisol.unit}
              reference={refs.hormones.cortisol.range}
            />
            <LabInput
              label="Insulin"
              value={profile.labData.hormones.insulin}
              onChange={(v) => updateHormone("insulin", v)}
              unit={refs.hormones.insulin.unit}
              reference={refs.hormones.insulin.range}
            />
            <LabInput
              label="TSH (Thyroid)"
              value={profile.labData.hormones.thyroidTSH}
              onChange={(v) => updateHormone("thyroidTSH", v)}
              unit={refs.hormones.thyroidTSH.unit}
              reference={refs.hormones.thyroidTSH.range}
            />
          </div>
        </AccordionSection>

        <AccordionSection
          title="Vitamins & Minerals"
          isOpen={openSections.includes("vitamins")}
          onToggle={() => toggleSection("vitamins")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabInput
              label="Vitamin D"
              value={profile.labData.vitamins.vitaminD}
              onChange={(v) => updateVitamin("vitaminD", v)}
              unit={refs.vitamins.vitaminD.unit}
              reference={refs.vitamins.vitaminD.range}
            />
            <LabInput
              label="Vitamin B12"
              value={profile.labData.vitamins.vitaminB12}
              onChange={(v) => updateVitamin("vitaminB12", v)}
              unit={refs.vitamins.vitaminB12.unit}
              reference={refs.vitamins.vitaminB12.range}
            />
            <LabInput
              label="Vitamin B6"
              value={profile.labData.vitamins.vitaminB6}
              onChange={(v) => updateVitamin("vitaminB6", v)}
              unit={refs.vitamins.vitaminB6.unit}
              reference={refs.vitamins.vitaminB6.range}
            />
            <LabInput
              label="Iron"
              value={profile.labData.vitamins.iron}
              onChange={(v) => updateVitamin("iron", v)}
              unit={refs.vitamins.iron.unit}
              reference={refs.vitamins.iron.range}
            />
            <LabInput
              label="Ferritin"
              value={profile.labData.vitamins.ferritin}
              onChange={(v) => updateVitamin("ferritin", v)}
              unit={refs.vitamins.ferritin.unit}
              reference={profile.sexAtBirth === "female" ? refs.vitamins.ferritin.femaleRange : refs.vitamins.ferritin.maleRange}
            />
          </div>
        </AccordionSection>

        <AccordionSection
          title="General Health"
          isOpen={openSections.includes("general")}
          onToggle={() => toggleSection("general")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabInput
              label="Fasting Glucose"
              value={profile.labData.generalHealth.glucose}
              onChange={(v) => updateGeneralHealth("glucose", v)}
              unit={refs.generalHealth.glucose.unit}
              reference={refs.generalHealth.glucose.range}
            />
            <LabInput
              label="HbA1c"
              value={profile.labData.generalHealth.hba1c}
              onChange={(v) => updateGeneralHealth("hba1c", v)}
              unit={refs.generalHealth.hba1c.unit}
              reference={refs.generalHealth.hba1c.range}
            />
            <LabInput
              label="LDL Cholesterol"
              value={profile.labData.generalHealth.ldl}
              onChange={(v) => updateGeneralHealth("ldl", v)}
              unit={refs.generalHealth.ldl.unit}
              reference={refs.generalHealth.ldl.range}
            />
            <LabInput
              label="HDL Cholesterol"
              value={profile.labData.generalHealth.hdl}
              onChange={(v) => updateGeneralHealth("hdl", v)}
              unit={refs.generalHealth.hdl.unit}
              reference={refs.generalHealth.hdl.range}
            />
            <LabInput
              label="Triglycerides"
              value={profile.labData.generalHealth.triglycerides}
              onChange={(v) => updateGeneralHealth("triglycerides", v)}
              unit={refs.generalHealth.triglycerides.unit}
              reference={refs.generalHealth.triglycerides.range}
            />
          </div>
        </AccordionSection>
      </div>
    </motion.div>
  );
}
