"use client";

import { motion } from "framer-motion";
import { FlaskConical, UserCheck, BookOpen } from "lucide-react";

const STATS = [
  { value: "500+", label: "Peer-Reviewed Studies" },
  { value: "12", label: "Registered Dietitians" },
  { value: "94%", label: "Recommendation Accuracy" },
  { value: "3,200+", label: "Clinical Trials Referenced" },
];

const METHODOLOGY_CARDS = [
  {
    icon: FlaskConical,
    title: "Evidence Grading",
    description:
      "We classify each supplement by evidence tier: Strong (multiple RCTs), Emerging (observational data), or Limited (anecdotal).",
  },
  {
    icon: UserCheck,
    title: "Expert Review",
    description:
      "Every AI-generated recommendation is cross-checked against protocols from our network of RDs and clinical nutritionists.",
  },
  {
    icon: BookOpen,
    title: "PubMed Integration",
    description:
      "Our AI references PubMed, Cochrane Reviews, and NIH databases in real-time to provide citations for key claims.",
  },
];

const TRUST_LOGOS = [
  "PubMed",
  "NIH",
  "Cochrane Reviews",
  "Harvard T.H. Chan",
  "Mayo Clinic",
  "Cleveland Clinic",
];

export default function ScienceSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <FlaskConical className="w-4 h-4" />
            Science-Backed
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Built on Peer-Reviewed Science
          </h2>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Every recommendation is grounded in clinical research, reviewed by registered
            dietitians, and validated against the latest nutritional evidence.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl px-6 py-6 text-center"
            >
              <p className="text-3xl font-bold text-emerald-700">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Methodology cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {METHODOLOGY_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust logos */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            References from trusted institutions
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {TRUST_LOGOS.map((name) => (
              <span
                key={name}
                className="px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-full border border-gray-200"
              >
                {name}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 max-w-lg mx-auto">
            * NutraLens references these institutions&apos; published research. No official
            affiliation implied.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
