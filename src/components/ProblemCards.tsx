"use client";

import { motion } from "framer-motion";
import { Copy, HelpCircle, AlertTriangle } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const problems = [
  {
    icon: Copy,
    title: "Generic Formulations",
    description:
      "One-size-fits-all supplements ignore your unique biology, goals, and health conditions. What works for someone else may not work for you.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: HelpCircle,
    title: "Conflicting Advice",
    description:
      "Influencers, online forums, and supplement stores offer contradictory recommendations, leaving you confused and unsure what to trust.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: AlertTriangle,
    title: "Unknown Interactions",
    description:
      "Taking multiple supplements without understanding potential interactions can lead to nutrient imbalances, wasted money, or health risks.",
    color: "from-red-500 to-rose-500",
  },
];

export default function ProblemCards() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The Problem With{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Today&apos;s Supplements
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Millions consume supplements daily, but most do it in a way that&apos;s ineffective, unsafe, or wasteful.
          </p>
        </motion.div>

        {/* Problem Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group"
              >
                <div className="glass-strong rounded-3xl p-8 h-full relative overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  {/* Icon Background Gradient */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${problem.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${problem.color} shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {problem.description}
                  </p>

                  {/* Bottom Accent Line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${problem.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
