"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { HealthProfile, defaultHealthProfile } from "@/types/health-profile";

const STORAGE_KEY = "nutralens_health_profile";

interface HealthProfileContextType {
  profile: HealthProfile;
  updateProfile: (updates: Partial<HealthProfile>) => void;
  clearProfile: () => void;
  isOnboardingComplete: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  isLoading: boolean;
}

const HealthProfileContext = createContext<HealthProfileContextType | undefined>(undefined);

export function HealthProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<HealthProfile>(defaultHealthProfile);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HealthProfile;
        setProfile(parsed);
        // Don't show onboarding if already completed
        if (!parsed.completedAt) {
          setShowOnboarding(true);
        }
      } else {
        // No profile exists, show onboarding
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error loading health profile:", error);
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  const saveToStorage = useCallback((profileData: HealthProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    } catch (error) {
      console.error("Error saving health profile:", error);
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<HealthProfile>) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const clearProfile = useCallback(() => {
    const newProfile = {
      ...defaultHealthProfile,
      lastUpdated: new Date().toISOString(),
    };
    setProfile(newProfile);
    saveToStorage(newProfile);
    setShowOnboarding(true);
  }, [saveToStorage]);

  const isOnboardingComplete = profile.completedAt !== null;

  return (
    <HealthProfileContext.Provider
      value={{
        profile,
        updateProfile,
        clearProfile,
        isOnboardingComplete,
        showOnboarding,
        setShowOnboarding,
        isLoading,
      }}
    >
      {children}
    </HealthProfileContext.Provider>
  );
}

export function useHealthProfile() {
  const context = useContext(HealthProfileContext);
  if (context === undefined) {
    throw new Error("useHealthProfile must be used within a HealthProfileProvider");
  }
  return context;
}

// Helper function to format profile for AI prompt
export function formatProfileForAI(profile: HealthProfile): string {
  const parts: string[] = [];

  // Demographics
  const demographics: string[] = [];
  if (profile.age) demographics.push(`Age: ${profile.age}`);
  if (profile.sexAtBirth && profile.sexAtBirth !== 'prefer_not_to_say') {
    demographics.push(`Sex: ${profile.sexAtBirth}`);
  }
  if (profile.genderIdentity) demographics.push(`Gender: ${profile.genderIdentity}`);
  if (demographics.length > 0) {
    parts.push(`Demographics: ${demographics.join(", ")}`);
  }

  // Medical conditions
  const conditions: string[] = [];
  if (profile.liverConditions.length > 0) {
    conditions.push(`Liver: ${profile.liverConditions.join(", ")}`);
  }
  if (profile.kidneyConditions.length > 0) {
    conditions.push(`Kidney: ${profile.kidneyConditions.join(", ")}`);
  }
  if (profile.digestiveConditions.length > 0) {
    conditions.push(`Digestive: ${profile.digestiveConditions.join(", ")}`);
  }
  if (profile.otherConditions.length > 0) {
    conditions.push(`Other: ${profile.otherConditions.join(", ")}`);
  }
  if (conditions.length > 0) {
    parts.push(`Medical Conditions: ${conditions.join("; ")}`);
  } else {
    parts.push("Medical Conditions: None reported");
  }

  // Health goals
  const activeGoals = Object.entries(profile.goals)
    .filter(([, active]) => active)
    .map(([goal]) => {
      const labels: Record<string, string> = {
        fitness: "General Fitness",
        muscleMass: "Muscle Mass",
        strength: "Strength",
        mentalPerformance: "Mental Performance",
        longevity: "Longevity",
        painMitigation: "Pain Mitigation",
      };
      return labels[goal] || goal;
    });
  if (activeGoals.length > 0) {
    parts.push(`Health Goals: ${activeGoals.join(", ")}`);
  }

  // Current supplements
  if (profile.currentSupplements.length > 0) {
    parts.push(`Current Supplements: ${profile.currentSupplements.join(", ")}`);
  }

  // Lab data
  const labParts: string[] = [];
  
  // Hormones
  const hormones = profile.labData.hormones;
  const hormoneValues: string[] = [];
  if (hormones.testosterone) hormoneValues.push(`Testosterone: ${hormones.testosterone} ng/dL`);
  if (hormones.estrogen) hormoneValues.push(`Estrogen: ${hormones.estrogen} pg/mL`);
  if (hormones.cortisol) hormoneValues.push(`Cortisol: ${hormones.cortisol} μg/dL`);
  if (hormones.insulin) hormoneValues.push(`Insulin: ${hormones.insulin} μIU/mL`);
  if (hormones.thyroidTSH) hormoneValues.push(`TSH: ${hormones.thyroidTSH} mIU/L`);
  if (hormoneValues.length > 0) labParts.push(...hormoneValues);

  // Vitamins
  const vitamins = profile.labData.vitamins;
  const vitaminValues: string[] = [];
  if (vitamins.vitaminD) vitaminValues.push(`Vitamin D: ${vitamins.vitaminD} ng/mL`);
  if (vitamins.vitaminB12) vitaminValues.push(`Vitamin B12: ${vitamins.vitaminB12} pg/mL`);
  if (vitamins.vitaminB6) vitaminValues.push(`Vitamin B6: ${vitamins.vitaminB6} ng/mL`);
  if (vitamins.iron) vitaminValues.push(`Iron: ${vitamins.iron} μg/dL`);
  if (vitamins.ferritin) vitaminValues.push(`Ferritin: ${vitamins.ferritin} ng/mL`);
  if (vitaminValues.length > 0) labParts.push(...vitaminValues);

  // General health
  const general = profile.labData.generalHealth;
  const generalValues: string[] = [];
  if (general.glucose) generalValues.push(`Glucose: ${general.glucose} mg/dL`);
  if (general.hba1c) generalValues.push(`HbA1c: ${general.hba1c}%`);
  if (general.ldl) generalValues.push(`LDL: ${general.ldl} mg/dL`);
  if (general.hdl) generalValues.push(`HDL: ${general.hdl} mg/dL`);
  if (general.triglycerides) generalValues.push(`Triglycerides: ${general.triglycerides} mg/dL`);
  if (generalValues.length > 0) labParts.push(...generalValues);

  if (labParts.length > 0) {
    parts.push(`Lab Values: ${labParts.join(", ")}`);
  }

  return parts.join("\n");
}
