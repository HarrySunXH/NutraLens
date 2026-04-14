"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Clock,
  Mail,
  Globe,
  Calendar,
  MessageCircle,
  Shield,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { dietitians, type Dietitian } from "@/components/chat/DietitianCard";

const SPECIALTIES = [
  "All",
  "Sports Nutrition",
  "Metabolic Health",
  "Women's Health",
  "Longevity",
  "Mental Wellness",
];

function getEmail(name: string): string {
  const parts = name.replace("Dr. ", "").toLowerCase().split(" ");
  return `${parts[0]}.${parts[parts.length - 1]}@nutralens.com`;
}

function getWebsite(name: string): string {
  const slug = name.replace("Dr. ", "").toLowerCase().replace(/\s+/g, "");
  return `nutralens.com/experts/${slug}`;
}

function ExpertCard({ dietitian, index }: { dietitian: Dietitian; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
    >
      {/* Full-width photo */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
        <Image
          src={dietitian.image}
          alt={dietitian.name}
          fill
          className="object-cover object-[center_5%]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Verified badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
          <CheckCircle className="w-3 h-3" />
          Verified
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name + title + rating */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-gray-900 text-base">{dietitian.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{dietitian.title}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-gray-900 text-sm">{dietitian.rating}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">({dietitian.reviewCount} reviews)</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {dietitian.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {dietitian.yearsExperience} yrs exp
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {dietitian.specialties.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{dietitian.bio}</p>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors">
            <Calendar className="w-4 h-4" />
            Book Consultation
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <MessageCircle className="w-4 h-4" />
            Message
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors">
            Profile
          </button>
        </div>

        {/* Contact info */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{getEmail(dietitian.name)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>{getWebsite(dietitian.name)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Available</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExpertsTab() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const filtered = dietitians.filter((d) => {
    if (selectedSpecialty === "All") return true;
    return d.specialties.some((s) =>
      s.toLowerCase().includes(selectedSpecialty.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Verified Nutrition Experts</h2>
            <p className="text-sm text-gray-500 mt-1">
              Connect with RDs, PhDs, and certified nutritionists
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100">
            <Shield className="w-3.5 h-3.5" />
            All experts are verified &amp; credentialed
          </div>
        </div>
      </div>

      {/* Specialty filter */}
      <div className="flex flex-wrap gap-2">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSpecialty(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedSpecialty === s
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Expert cards */}
      <div className="grid grid-cols-1 gap-5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No experts match the selected specialty.
          </div>
        ) : (
          filtered.map((d, i) => <ExpertCard key={d.id} dietitian={d} index={i} />)
        )}
      </div>
    </div>
  );
}
