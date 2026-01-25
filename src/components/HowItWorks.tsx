"use client";

import { motion } from "framer-motion";
import { ClipboardList, Brain, CheckCircle2, TrendingUp } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useRouter } from "next/navigation";

const steps = [
  {
    icon: ClipboardList,
    title: "Share Your Goals",
    description:
      "Tell us about your health goals, current supplements, diet, and any medical conditions. The more we know, the better your plan.",
    step: "01",
  },
  {
    icon: Brain,
    title: "AI Analyzes",
    description:
      "Our AI engine processes your information against thousands of scientific studies, interaction databases, and nutrition guidelines.",
    step: "02",
  },
  {
    icon: CheckCircle2,
    title: "Get Personalized Plan",
    description:
      "Receive a customized supplement plan with dosages, timing, quality recommendations, and potential interaction warnings.",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "Track & Optimize",
    description:
      "Monitor your progress, adjust based on results, and continuously optimize your regimen with AI-powered insights.",
    step: "04",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 gradient-mesh relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutraLens Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From confusion to clarity in four simple steps
          </p>
        </motion.div>

        {/* Steps Container */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Connecting Line - Desktop Only */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <div className="max-w-5xl mx-auto px-20">
              <div className="w-full h-full bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-300 rounded-full opacity-30" />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="glass-strong rounded-3xl p-8 text-center h-full hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {step.step}
                      </span>
                    </div>

                    {/* Icon Container */}
                    <div className="relative mb-6 inline-flex">
                      <div className="relative">
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200 transition-colors duration-300">
                          <Icon className="w-10 h-10 text-emerald-600" />
                        </div>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow Connector - Desktop Only */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-24 -right-4 w-8 h-8 items-center justify-center z-20">
                      <svg
                        className="w-6 h-6 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            Start Your Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
}
