"use client";

import { motion } from "framer-motion";
import { User, Check } from "lucide-react";
import { useHealthProfile } from "@/context/HealthProfileContext";

interface ProfileButtonProps {
  onClick: () => void;
}

export default function ProfileButton({ onClick }: ProfileButtonProps) {
  const { isOnboardingComplete } = useHealthProfile();

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
      title="Edit Health Profile"
    >
      <User className="w-5 h-5 text-gray-600" />
      {isOnboardingComplete && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
          <Check className="w-2 h-2 text-white" />
        </span>
      )}
    </motion.button>
  );
}
