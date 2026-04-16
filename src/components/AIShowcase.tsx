"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Award, Zap } from "lucide-react";
import { slideInLeft, slideInRight } from "@/lib/animations";

const capabilities = [
  {
    icon: Brain,
    title: "Neural Network Analysis",
    description: "Deep learning models trained on clinical research data",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Automated detection of contraindications and interactions",
  },
  {
    icon: Award,
    title: "Clinically Informed",
    description: "Recommendations backed by peer-reviewed studies",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Continuously learning from latest research",
  },
];

export default function AIShowcase() {
  return (
    <section className="py-20 gradient-mesh relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-teal-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Visualization */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Neural Network Visualization */}
            <div className="relative glass-strong rounded-3xl p-8 shadow-2xl">
              {/* Central Node */}
              <div className="relative flex items-center justify-center mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-50 animate-pulse-glow" />
                </motion.div>
              </div>

              {/* Connection Nodes */}
              <div className="grid grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <div className="w-16 h-16 rounded-2xl glass bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500" />
                    </div>
                    {/* Connection Line */}
                    <svg
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-8"
                      width="2"
                      height="32"
                    >
                      <motion.line
                        x1="1"
                        y1="0"
                        x2="1"
                        y2="32"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        animate={{
                          strokeDashoffset: [0, -8],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">10K+</div>
                  <div className="text-xs text-gray-600">Studies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">99.9%</div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">&lt;1s</div>
                  <div className="text-xs text-gray-600">Analysis</div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass px-4 py-2 rounded-full shadow-xl"
            >
              <span className="text-sm font-semibold text-emerald-600">
                AI-Powered
              </span>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI Technology
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Our proprietary AI engine analyzes your unique health profile against a
              vast database of scientific research to deliver personalized, evidence-based
              supplement recommendations.
            </p>

            {/* Capabilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {capability.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {capability.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="glass px-6 py-3 rounded-full">
                <span className="text-sm font-semibold text-gray-700">
                  Science-Backed
                </span>
              </div>
              <div className="glass px-6 py-3 rounded-full">
                <span className="text-sm font-semibold text-gray-700">
                  HIPAA Compliant
                </span>
              </div>
              <div className="glass px-6 py-3 rounded-full">
                <span className="text-sm font-semibold text-gray-700">
                  ISO Certified
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
