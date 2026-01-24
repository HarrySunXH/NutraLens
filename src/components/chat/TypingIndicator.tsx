"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 max-w-[80%]">
      {/* AI Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
        <Brain className="w-5 h-5 text-emerald-600" />
      </div>

      {/* Typing Dots */}
      <div className="glass-strong rounded-2xl rounded-tl-sm px-5 py-4">
        <motion.div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-emerald-500 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
