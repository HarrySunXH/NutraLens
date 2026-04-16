"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { HealthProfile, defaultHealthProfile } from "@/types/health-profile";
import ProgressBar from "./ProgressBar";
import StepBasicInfo from "./StepBasicInfo";
import StepMedicalHistory from "./StepMedicalHistory";
import StepHealthGoals from "./StepHealthGoals";
import StepLabResults from "./StepLabResults";
import StepSupplements from "./StepSupplements";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: HealthProfile) => void;
  initialProfile?: HealthProfile;
}

const STEP_TITLES = ["Basic Info", "Medical", "Goals", "Lab Results", "Supplements"];

export default function OnboardingModal({
  isOpen,
  onComplete,
  initialProfile,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<HealthProfile>(initialProfile || defaultHealthProfile);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        setCurrentStep(0);
        setProfile(initialProfile || defaultHealthProfile);
      });
    }
  }, [isOpen, initialProfile]);

  const updateProfile = (updates: Partial<HealthProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEP_TITLES.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete onboarding
      const completedProfile: HealthProfile = {
        ...profile,
        completedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      onComplete(completedProfile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    // Complete with current data
    const completedProfile: HealthProfile = {
      ...profile,
      completedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    onComplete(completedProfile);
  };

  const isLastStep = currentStep === STEP_TITLES.length - 1;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            // Don't close on backdrop click during onboarding
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">NutraLens Health Profile</h1>
                <p className="text-sm text-gray-500">Step {currentStep + 1} of {STEP_TITLES.length}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Complete Later
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 py-4 border-b border-gray-100">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={STEP_TITLES.length}
              stepTitles={STEP_TITLES}
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <StepBasicInfo key="basic" profile={profile} onUpdate={updateProfile} />
              )}
              {currentStep === 1 && (
                <StepMedicalHistory key="medical" profile={profile} onUpdate={updateProfile} />
              )}
              {currentStep === 2 && (
                <StepHealthGoals key="goals" profile={profile} onUpdate={updateProfile} />
              )}
              {currentStep === 3 && (
                <StepLabResults key="labs" profile={profile} onUpdate={updateProfile} />
              )}
              {currentStep === 4 && (
                <StepSupplements key="supplements" profile={profile} onUpdate={updateProfile} />
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                currentStep === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
              {currentStep === 3 && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Skip Lab Results
                </button>
              )}
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                {isLastStep ? (
                  <>
                    Complete
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
