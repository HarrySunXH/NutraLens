"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// DNA Helix Component
const DNAHelix = ({ side }: { side: "left" | "right" }) => {
  const baseDelay = side === "left" ? 0 : 0.5;
  const xPosition = side === "left" ? "left-0" : "right-0";
  
  return (
    <div className={`absolute ${xPosition} top-1/2 -translate-y-1/2 opacity-20 hidden lg:block`}>
      <svg width="120" height="600" viewBox="0 0 120 600" className="overflow-visible">
        {[...Array(15)].map((_, i) => (
          <g key={i}>
            {/* Left strand */}
            <motion.circle
              cx={60 + Math.sin(i * 0.8) * 40}
              cy={i * 40 + 20}
              r="8"
              className="fill-emerald-500"
              animate={{
                cx: [60 + Math.sin(i * 0.8) * 40, 60 + Math.sin(i * 0.8 + Math.PI) * 40, 60 + Math.sin(i * 0.8) * 40],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: baseDelay + i * 0.1,
                ease: "easeInOut",
              }}
            />
            {/* Right strand */}
            <motion.circle
              cx={60 + Math.sin(i * 0.8 + Math.PI) * 40}
              cy={i * 40 + 20}
              r="8"
              className="fill-teal-500"
              animate={{
                cx: [60 + Math.sin(i * 0.8 + Math.PI) * 40, 60 + Math.sin(i * 0.8) * 40, 60 + Math.sin(i * 0.8 + Math.PI) * 40],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: baseDelay + i * 0.1,
                ease: "easeInOut",
              }}
            />
            {/* Connecting line */}
            <motion.line
              x1={60 + Math.sin(i * 0.8) * 40}
              y1={i * 40 + 20}
              x2={60 + Math.sin(i * 0.8 + Math.PI) * 40}
              y2={i * 40 + 20}
              className="stroke-emerald-400"
              strokeWidth="2"
              animate={{
                x1: [60 + Math.sin(i * 0.8) * 40, 60 + Math.sin(i * 0.8 + Math.PI) * 40, 60 + Math.sin(i * 0.8) * 40],
                x2: [60 + Math.sin(i * 0.8 + Math.PI) * 40, 60 + Math.sin(i * 0.8) * 40, 60 + Math.sin(i * 0.8 + Math.PI) * 40],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: baseDelay + i * 0.1,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

// Floating Molecule Component
const Molecule = ({ className, delay = 0, size = "md" }: { className: string; delay?: number; size?: "sm" | "md" | "lg" }) => {
  const sizeMap = { sm: 40, md: 60, lg: 80 };
  const s = sizeMap[size];
  
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [-20, 20, -20],
        rotate: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 20, repeat: Infinity, ease: "linear", delay },
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <svg width={s} height={s} viewBox="0 0 100 100" className="opacity-30">
        {/* Central atom */}
        <circle cx="50" cy="50" r="15" className="fill-emerald-500" />
        {/* Orbital electrons */}
        <circle cx="50" cy="20" r="8" className="fill-teal-400" />
        <circle cx="75" cy="65" r="8" className="fill-amber-400" />
        <circle cx="25" cy="65" r="8" className="fill-emerald-400" />
        {/* Bonds */}
        <line x1="50" y1="35" x2="50" y2="28" className="stroke-emerald-300" strokeWidth="3" />
        <line x1="62" y1="58" x2="68" y2="62" className="stroke-emerald-300" strokeWidth="3" />
        <line x1="38" y1="58" x2="32" y2="62" className="stroke-emerald-300" strokeWidth="3" />
      </svg>
    </motion.div>
  );
};

// Floating Vitamin Capsule
const VitaminCapsule = ({ className, delay = 0, color = "emerald" }: { className: string; delay?: number; color?: "emerald" | "amber" | "rose" | "blue" }) => {
  const colors = {
    emerald: ["#10B981", "#059669"],
    amber: ["#F59E0B", "#D97706"],
    rose: ["#F43F5E", "#E11D48"],
    blue: ["#3B82F6", "#2563EB"],
  };
  
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [-15, 15, -15],
        rotate: [-10, 10, -10],
        x: [-5, 5, -5],
      }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <svg width="50" height="24" viewBox="0 0 50 24" className="opacity-40 drop-shadow-lg">
        <defs>
          <linearGradient id={`capsule-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors[color][0]} />
            <stop offset="50%" stopColor={colors[color][0]} />
            <stop offset="50%" stopColor={colors[color][1]} />
            <stop offset="100%" stopColor={colors[color][1]} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="50" height="24" rx="12" fill={`url(#capsule-${color})`} />
        <ellipse cx="12" cy="12" rx="10" ry="10" fill={colors[color][0]} opacity="0.8" />
        <ellipse cx="38" cy="12" rx="10" ry="10" fill={colors[color][1]} opacity="0.8" />
      </svg>
    </motion.div>
  );
};

// Floating Leaf
const FloatingLeaf = ({ className, delay = 0, size = 40 }: { className: string; delay?: number; size?: number }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [-10, 10, -10],
      rotate: [-15, 15, -15],
      x: [-5, 5, -5],
    }}
    transition={{
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" className="opacity-25">
      <path
        d="M50 10 C20 30, 10 60, 50 90 C90 60, 80 30, 50 10"
        className="fill-emerald-500"
      />
      <path
        d="M50 20 C50 20, 50 80, 50 80"
        className="stroke-emerald-300"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M50 35 C50 35, 35 45, 30 50"
        className="stroke-emerald-300"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M50 50 C50 50, 65 55, 70 60"
        className="stroke-emerald-300"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  </motion.div>
);

// Pre-generated particle positions to avoid hydration mismatch
const particleData = [
  { left: 5, top: 12 }, { left: 92, top: 8 }, { left: 23, top: 45 }, { left: 78, top: 23 },
  { left: 45, top: 67 }, { left: 12, top: 89 }, { left: 67, top: 34 }, { left: 34, top: 78 },
  { left: 89, top: 56 }, { left: 56, top: 12 }, { left: 8, top: 34 }, { left: 73, top: 89 },
  { left: 28, top: 56 }, { left: 95, top: 45 }, { left: 41, top: 23 }, { left: 18, top: 67 },
  { left: 62, top: 91 }, { left: 85, top: 17 }, { left: 37, top: 42 }, { left: 53, top: 73 },
  { left: 15, top: 28 }, { left: 71, top: 61 }, { left: 48, top: 85 }, { left: 82, top: 38 },
  { left: 26, top: 19 }, { left: 59, top: 52 }, { left: 94, top: 76 }, { left: 31, top: 94 },
  { left: 68, top: 7 }, { left: 11, top: 48 },
];

const particleColors = ["#10B981", "#14B8A6", "#F59E0B", "#3B82F6"];
const particleDurations = [3.2, 4.1, 3.8, 4.5, 3.5, 4.2, 3.9, 4.3, 3.6, 4.0, 3.3, 4.4, 3.7, 4.1, 3.4, 4.2, 3.8, 4.0, 3.5, 4.3, 3.9, 4.1, 3.6, 4.4, 3.2, 4.0, 3.7, 4.2, 3.4, 3.8];
const particleDelays = [0.2, 1.5, 0.8, 2.1, 0.5, 1.8, 1.2, 2.5, 0.3, 1.6, 0.9, 2.3, 0.6, 1.9, 1.1, 2.7, 0.4, 1.7, 1.0, 2.4, 0.7, 2.0, 1.3, 2.6, 0.1, 1.4, 0.85, 2.2, 0.55, 1.85];

// Nutrient Particles
const NutrientParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {particleData.map((pos, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          left: `${pos.left}%`,
          top: `${pos.top}%`,
          backgroundColor: particleColors[i % 4],
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: particleDurations[i],
          repeat: Infinity,
          delay: particleDelays[i],
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Hexagonal Grid Pattern
const HexGrid = () => (
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
    <svg width="100%" height="100%" className="absolute inset-0">
      <defs>
        <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
          <polygon
            points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4"
            fill="none"
            stroke="#10B981"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
  </div>
);

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh pt-20">
      {/* Hexagonal Grid Background */}
      <HexGrid />
      
      {/* Nutrient Particles */}
      <NutrientParticles />
      
      {/* DNA Helixes on sides */}
      <DNAHelix side="left" />
      <DNAHelix side="right" />

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-emerald-400/30 to-teal-300/30 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-20 right-10 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-r from-teal-400/30 to-emerald-300/30 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute top-1/2 left-1/3 w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-emerald-300/20 to-teal-400/20 blur-3xl"
        />
      </div>

      {/* Floating Molecules */}
      <Molecule className="top-32 right-[15%] hidden md:block" delay={0} size="lg" />
      <Molecule className="top-48 left-[20%] hidden lg:block" delay={1} size="md" />
      <Molecule className="bottom-40 right-[25%] hidden md:block" delay={2} size="sm" />
      
      {/* Floating Vitamin Capsules */}
      <VitaminCapsule className="top-40 right-[30%] hidden md:block" delay={0} color="emerald" />
      <VitaminCapsule className="top-24 left-[25%] hidden lg:block" delay={1.5} color="amber" />
      <VitaminCapsule className="bottom-32 left-[15%] hidden md:block" delay={0.5} color="rose" />
      <VitaminCapsule className="bottom-48 right-[10%] hidden lg:block" delay={2} color="blue" />
      
      {/* Floating Leaves */}
      <FloatingLeaf className="top-36 left-[10%] hidden lg:block" delay={0} size={50} />
      <FloatingLeaf className="bottom-28 right-[20%] hidden md:block" delay={1} size={35} />
      <FloatingLeaf className="top-1/3 right-[8%] hidden lg:block" delay={2} size={45} />

      {/* Glass Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-20 hidden lg:block"
      >
        <div className="glass p-4 rounded-2xl shadow-xl">
          <svg width="32" height="32" viewBox="0 0 100 100" className="text-emerald-600">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
            <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.3" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-20 hidden lg:block"
      >
        <div className="glass p-4 rounded-2xl shadow-xl">
          <Sparkles className="w-8 h-8 text-teal-600" />
        </div>
      </motion.div>

      {/* Hero Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700">AI-Powered Supplement Intelligence</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Your Supplements,{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
            Personalized
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Stop guessing with generic formulas and conflicting advice. Get science-backed,
          personalized supplement recommendations tailored to your unique biology and goals.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => router.push("/chat")}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>Start Chat</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button 
            onClick={() => {
              const element = document.getElementById("how-it-works");
              if (element) {
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                });
              }
            }}
            className="group px-8 py-4 rounded-full glass-strong text-gray-700 font-semibold text-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
          >
            <span className="flex items-center space-x-2">
              <span>See How It Works</span>
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Science-Backed</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Privacy First</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Personalized Plans</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
