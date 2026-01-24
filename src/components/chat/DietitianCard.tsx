"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, ChevronLeft, ChevronRight, Calendar, MessageCircle } from "lucide-react";
import Image from "next/image";

export interface Dietitian {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  yearsExperience: number;
  bio: string;
}

// Dummy dietitian data with professional headshot images
export const dietitians: Dietitian[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    title: "Registered Dietitian Nutritionist",
    specialties: ["Sports Nutrition", "Weight Management", "Gut Health"],
    rating: 4.9,
    reviewCount: 328,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
    yearsExperience: 12,
    bio: "Specializing in evidence-based nutrition therapy with a focus on sustainable lifestyle changes.",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Clinical Nutritionist, PhD",
    specialties: ["Metabolic Health", "Longevity", "Supplement Optimization"],
    rating: 4.8,
    reviewCount: 256,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    yearsExperience: 15,
    bio: "Research-focused nutritionist helping clients optimize their health through personalized protocols.",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    title: "Functional Medicine Dietitian",
    specialties: ["Hormonal Balance", "Women's Health", "Autoimmune Nutrition"],
    rating: 4.9,
    reviewCount: 412,
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop",
    yearsExperience: 10,
    bio: "Integrative approach combining functional medicine with clinical nutrition for whole-body wellness.",
  },
  {
    id: "4",
    name: "Dr. James Thompson",
    title: "Sports Dietitian, CSSD",
    specialties: ["Athletic Performance", "Muscle Building", "Recovery Nutrition"],
    rating: 4.7,
    reviewCount: 189,
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    yearsExperience: 8,
    bio: "Former professional athlete turned sports nutritionist, helping athletes reach peak performance.",
  },
  {
    id: "5",
    name: "Dr. Priya Sharma",
    title: "Integrative Nutritionist",
    specialties: ["Digestive Health", "Food Sensitivities", "Mental Wellness"],
    rating: 4.9,
    reviewCount: 367,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop",
    yearsExperience: 14,
    bio: "Holistic nutritionist specializing in the gut-brain connection and personalized elimination diets.",
  },
];

// Single Dietitian Card
function DietitianCardItem({ dietitian }: { dietitian: Dietitian }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="flex-shrink-0 w-64 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all cursor-pointer group"
    >
      {/* Full-width Image */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
        <Image
          src={dietitian.image}
          alt={dietitian.name}
          fill
          className="object-cover object-[center_5%]"
          unoptimized
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col">
        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors text-sm">
          {dietitian.name}
        </h4>
        <p className="text-xs text-gray-500 mt-0.5 h-8 line-clamp-2">{dietitian.title}</p>

        {/* Rating & Location */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium">{dietitian.rating}</span>
            <span className="text-gray-400">({dietitian.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500">{dietitian.location}</span>
          </div>
        </div>

        {/* Specialties - Fixed height for alignment */}
        <div className="flex flex-wrap gap-1 mt-3 h-12 items-start">
          {dietitian.specialties.slice(0, 2).map((specialty) => (
            <span
              key={specialty}
              className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full"
            >
              {specialty}
            </span>
          ))}
          {dietitian.specialties.length > 2 && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              +{dietitian.specialties.length - 2}
            </span>
          )}
        </div>

        {/* Experience */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>{dietitian.yearsExperience} years experience</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer">
            <Calendar className="w-3.5 h-3.5" />
            Book
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <MessageCircle className="w-3.5 h-3.5" />
            Message
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Dietitian Slider Component
export default function DietitianSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <span className="text-white text-sm">👨‍⚕️</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Recommended Dietitians</h3>
            <p className="text-xs text-gray-500">Get personalized guidance from certified experts</p>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex gap-1">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              canScrollLeft
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-gray-50 text-gray-300 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              canScrollRight
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-gray-50 text-gray-300 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        onScroll={checkScrollability}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dietitians.map((dietitian) => (
          <DietitianCardItem key={dietitian.id} dietitian={dietitian} />
        ))}
      </div>
    </div>
  );
}
