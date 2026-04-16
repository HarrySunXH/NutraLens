"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ChevronUp, Award, TrendingUp, Filter } from "lucide-react";

interface DimensionScore {
  ingredientQuality: number;
  effectiveness: number;
  dosageExperience: number;
  userTypeMatch: number;
}

interface SupplementRank {
  id: string;
  rank: number;
  name: string;
  brand: string;
  category: string;
  overallScore: number;
  dimensions: DimensionScore;
  totalReviews: number;
  goals: string[];
  trending: boolean;
  userTypes: string[];
  evidenceLevel: "strong" | "emerging" | "limited";
}

const SUPPLEMENTS: SupplementRank[] = [
  {
    id: "1",
    rank: 1,
    name: "Magnesium Glycinate",
    brand: "Thorne Research",
    category: "Minerals",
    overallScore: 4.8,
    dimensions: { ingredientQuality: 4.9, effectiveness: 4.8, dosageExperience: 4.7, userTypeMatch: 4.8 },
    totalReviews: 1243,
    goals: ["Sleep", "Stress Relief", "Muscle Recovery"],
    trending: true,
    userTypes: ["Athletes", "Professionals", "Seniors"],
    evidenceLevel: "strong",
  },
  {
    id: "2",
    rank: 2,
    name: "Vitamin D3 + K2",
    brand: "Life Extension",
    category: "Vitamins",
    overallScore: 4.7,
    dimensions: { ingredientQuality: 4.8, effectiveness: 4.7, dosageExperience: 4.9, userTypeMatch: 4.6 },
    totalReviews: 987,
    goals: ["Immunity", "Bone Health", "Longevity"],
    trending: false,
    userTypes: ["General Wellness", "Seniors", "Office Workers"],
    evidenceLevel: "strong",
  },
  {
    id: "3",
    rank: 3,
    name: "Creatine Monohydrate",
    brand: "Optimum Nutrition",
    category: "Performance",
    overallScore: 4.7,
    dimensions: { ingredientQuality: 4.6, effectiveness: 4.9, dosageExperience: 4.5, userTypeMatch: 4.7 },
    totalReviews: 2108,
    goals: ["Muscle Mass", "Strength", "Athletic Performance"],
    trending: true,
    userTypes: ["Athletes", "Bodybuilders", "Fitness Enthusiasts"],
    evidenceLevel: "strong",
  },
  {
    id: "4",
    rank: 4,
    name: "Omega-3 Fish Oil",
    brand: "Nordic Naturals",
    category: "Essential Fats",
    overallScore: 4.6,
    dimensions: { ingredientQuality: 4.8, effectiveness: 4.5, dosageExperience: 4.4, userTypeMatch: 4.7 },
    totalReviews: 1567,
    goals: ["Heart Health", "Brain Function", "Inflammation"],
    trending: false,
    userTypes: ["General Wellness", "Seniors", "Professionals"],
    evidenceLevel: "strong",
  },
  {
    id: "5",
    rank: 5,
    name: "Ashwagandha KSM-66",
    brand: "Jarrow Formulas",
    category: "Adaptogens",
    overallScore: 4.5,
    dimensions: { ingredientQuality: 4.7, effectiveness: 4.5, dosageExperience: 4.3, userTypeMatch: 4.6 },
    totalReviews: 832,
    goals: ["Stress Relief", "Mental Performance", "Hormonal Balance"],
    trending: true,
    userTypes: ["Professionals", "Students", "Athletes"],
    evidenceLevel: "emerging",
  },
  {
    id: "6",
    rank: 6,
    name: "Collagen Peptides",
    brand: "Vital Proteins",
    category: "Proteins",
    overallScore: 4.4,
    dimensions: { ingredientQuality: 4.5, effectiveness: 4.4, dosageExperience: 4.6, userTypeMatch: 4.3 },
    totalReviews: 1102,
    goals: ["Joint Health", "Skin", "Hair & Nails"],
    trending: false,
    userTypes: ["Women 30+", "Athletes", "Seniors"],
    evidenceLevel: "emerging",
  },
  {
    id: "7",
    rank: 7,
    name: "Coenzyme Q10",
    brand: "Jarrow Formulas",
    category: "Antioxidants",
    overallScore: 4.3,
    dimensions: { ingredientQuality: 4.6, effectiveness: 4.2, dosageExperience: 4.4, userTypeMatch: 4.1 },
    totalReviews: 644,
    goals: ["Energy", "Heart Health", "Longevity"],
    trending: false,
    userTypes: ["Seniors", "Heart Health", "Statin Users"],
    evidenceLevel: "emerging",
  },
  {
    id: "8",
    rank: 8,
    name: "Berberine",
    brand: "Thorne Research",
    category: "Metabolic",
    overallScore: 4.6,
    dimensions: { ingredientQuality: 4.7, effectiveness: 4.6, dosageExperience: 4.3, userTypeMatch: 4.7 },
    totalReviews: 876,
    goals: ["Weight Management", "Appetite Control", "Blood Sugar"],
    trending: true,
    userTypes: ["Weight Management", "Metabolic Health", "Blood Sugar Support"],
    evidenceLevel: "strong",
  },
  {
    id: "9",
    rank: 9,
    name: "Glucomannan",
    brand: "NOW Foods",
    category: "Fiber",
    overallScore: 4.3,
    dimensions: { ingredientQuality: 4.4, effectiveness: 4.3, dosageExperience: 4.0, userTypeMatch: 4.5 },
    totalReviews: 543,
    goals: ["Weight Management", "Appetite Control", "Digestive Health"],
    trending: true,
    userTypes: ["Weight Management", "Dieters", "Blood Sugar Management"],
    evidenceLevel: "strong",
  },
  {
    id: "10",
    rank: 10,
    name: "L-Carnitine",
    brand: "NOW Foods",
    category: "Metabolic",
    overallScore: 3.9,
    dimensions: { ingredientQuality: 4.2, effectiveness: 3.7, dosageExperience: 4.4, userTypeMatch: 3.8 },
    totalReviews: 789,
    goals: ["Weight Management", "Energy", "Athletic Performance"],
    trending: false,
    userTypes: ["Weight Management", "Athletes", "Dieters"],
    evidenceLevel: "emerging",
  },
];

const CATEGORIES = ["All", "Metabolic", "Fiber", "Vitamins", "Minerals", "Performance", "Adaptogens", "Essential Fats", "Proteins", "Antioxidants"];
const GOALS = ["All", "Weight Management", "Appetite Control", "Energy", "Sleep", "Stress Relief", "Immunity", "Mental Performance", "Blood Sugar"];

const DIMENSION_LABELS: Record<keyof DimensionScore, string> = {
  ingredientQuality: "Ingredient Quality",
  effectiveness: "Effectiveness",
  dosageExperience: "Dosage Experience",
  userTypeMatch: "User Type Match",
};

function StarBar({ score, max = 5 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color = score >= 4.5 ? "from-emerald-400 to-teal-500" : score >= 4.0 ? "from-yellow-400 to-amber-500" : "from-orange-400 to-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-7 text-right">{score.toFixed(1)}</span>
    </div>
  );
}

function RatingStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.floor(score) ? "text-amber-400 fill-amber-400" : s - 0.5 <= score ? "text-amber-400 fill-amber-200" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

const evidenceConfig = {
  strong: { label: "Strong Evidence", color: "text-blue-700 bg-blue-50" },
  emerging: { label: "Emerging", color: "text-amber-700 bg-amber-50" },
  limited: { label: "Limited", color: "text-gray-600 bg-gray-100" },
};

function SupplementCard({ supp, rank }: { supp: SupplementRank; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  const rankColor =
    rank === 1 ? "bg-amber-400 text-white" :
    rank === 2 ? "bg-gray-400 text-white" :
    rank === 3 ? "bg-amber-700 text-white" :
    "bg-gray-100 text-gray-600";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Rank badge */}
          <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${rankColor}`}>
            {rank <= 3 ? <Award className="w-4 h-4" /> : `#${rank}`}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{supp.name}</h3>
                  {supp.trending && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${evidenceConfig[supp.evidenceLevel].color}`}>
                    {evidenceConfig[supp.evidenceLevel].label}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{supp.brand} · {supp.category}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">{supp.overallScore.toFixed(1)}</div>
                  <RatingStars score={supp.overallScore} />
                  <div className="text-xs text-gray-400 mt-0.5">{supp.totalReviews.toLocaleString()} reviews</div>
                </div>
              </div>
            </div>

            {/* Goal tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {supp.goals.map((g) => (
                <span key={g} className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">{g}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors py-1"
        >
          {expanded ? <><ChevronUp className="w-4 h-4" /> Hide breakdown</> : <><ChevronDown className="w-4 h-4" /> View detailed scores</>}
        </button>
      </div>

      {/* Expanded dimension breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-50"
          >
            <div className="px-5 py-4 bg-gray-50/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.entries(supp.dimensions) as [keyof DimensionScore, number][]).map(([key, val]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-medium">{DIMENSION_LABELS[key]}</span>
                  </div>
                  <StarBar score={val} />
                </div>
              ))}
              <div className="sm:col-span-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-2">Best for</p>
                <div className="flex flex-wrap gap-1.5">
                  {supp.userTypes.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-600">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SupplementRankings() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGoal, setSelectedGoal] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = SUPPLEMENTS.filter((s) => {
    const catOk = selectedCategory === "All" || s.category === selectedCategory;
    const goalOk = selectedGoal === "All" || s.goals.includes(selectedGoal);
    return catOk && goalOk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Community Rankings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ranked by {SUPPLEMENTS.reduce((s, r) => s + r.totalReviews, 0).toLocaleString()} verified user reviews across 4 dimensions
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          {(selectedCategory !== "All" || selectedGoal !== "All") && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === c ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Health Goal</p>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGoal(g)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedGoal === g ? "bg-teal-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300"}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rankings list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No supplements match the selected filters.</div>
        ) : (
          filtered.map((supp, i) => <SupplementCard key={supp.id} supp={supp} rank={i + 1} />)
        )}
      </div>
    </div>
  );
}
