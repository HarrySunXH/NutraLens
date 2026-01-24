"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Target,
  Database,
  LineChart,
  Users,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning algorithms analyze your unique profile against thousands of scientific studies to create personalized recommendations.",
    gradient: "from-emerald-500 to-teal-500",
    size: "large",
  },
  {
    icon: ShieldCheck,
    title: "Interaction Checker",
    description:
      "Real-time detection of dangerous supplement-drug and supplement-supplement interactions.",
    gradient: "from-blue-500 to-cyan-500",
    size: "medium",
  },
  {
    icon: Target,
    title: "Personalized Plans",
    description:
      "Custom dosages and timing based on your biology, goals, and lifestyle.",
    gradient: "from-purple-500 to-pink-500",
    size: "medium",
  },
  {
    icon: Database,
    title: "Quality Database",
    description:
      "Access verified supplement quality ratings and third-party testing results.",
    gradient: "from-amber-500 to-orange-500",
    size: "small",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description:
      "Monitor your health metrics and adjust your regimen for optimal results.",
    gradient: "from-green-500 to-emerald-500",
    size: "small",
  },
  {
    icon: Users,
    title: "Expert Integration",
    description:
      "Connect with certified nutritionists for professional guidance when needed.",
    gradient: "from-indigo-500 to-purple-500",
    size: "small",
  },
];

export default function FeaturesBento() {
  return (
    <section id="features" className="py-20 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30" />

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
            Powerful{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to optimize your supplement routine with confidence
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
          {/* Large Card - AI Analysis */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-2 lg:row-span-2 group"
          >
            <div className="glass-strong rounded-3xl p-8 md:p-10 h-full relative overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />

              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {features[0].title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {features[0].description}
                </p>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "10K+ Studies Analyzed",
                    "Personalized Insights",
                    "Real-time Updates",
                    "Clinical Accuracy",
                  ].map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-gray-700 font-medium">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medium Cards */}
          {features.slice(1, 3).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="lg:row-span-1 group"
              >
                <div className="glass-strong rounded-3xl p-8 h-full relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* Icon Background Gradient */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Small Cards */}
          {features.slice(3).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={fadeInUp} className="group">
                <div className="glass-strong rounded-3xl p-8 h-full relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* Icon Background Gradient */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-4`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
