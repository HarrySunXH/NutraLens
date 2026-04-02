"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Star, TrendingUp, ChevronRight, Sparkles, Target } from "lucide-react";
import { useHealthProfile } from "@/context/HealthProfileContext";

interface SimilarUser {
  id: string;
  handle: string;
  age: number;
  matchScore: number;
  sharedGoals: string[];
  topSupplements: { name: string; rating: number; weeks: number }[];
  conditions: string[];
  outcome: string;
}

const MOCK_SIMILAR_USERS: SimilarUser[] = [
  {
    id: "1",
    handle: "User_A47F",
    age: 31,
    matchScore: 94,
    sharedGoals: ["Muscle Mass", "Strength"],
    topSupplements: [
      { name: "Creatine Monohydrate", rating: 5, weeks: 12 },
      { name: "Whey Protein", rating: 5, weeks: 24 },
      { name: "Vitamin D3", rating: 4, weeks: 16 },
    ],
    conditions: [],
    outcome: "Gained 8 lbs of lean muscle over 3 months. Strength increased significantly across all main lifts.",
  },
  {
    id: "2",
    handle: "User_B93C",
    age: 29,
    matchScore: 91,
    sharedGoals: ["Sleep", "Stress Relief", "Mental Performance"],
    topSupplements: [
      { name: "Magnesium Glycinate", rating: 5, weeks: 8 },
      { name: "Ashwagandha KSM-66", rating: 4, weeks: 10 },
      { name: "L-Theanine", rating: 4, weeks: 6 },
    ],
    conditions: [],
    outcome: "Sleep quality improved dramatically. Stress feels manageable and focus during work hours is noticeably better.",
  },
  {
    id: "3",
    handle: "User_D12K",
    age: 44,
    matchScore: 88,
    sharedGoals: ["Longevity", "Joint Health", "Immunity"],
    topSupplements: [
      { name: "Omega-3 Fish Oil", rating: 5, weeks: 20 },
      { name: "Vitamin D3 + K2", rating: 5, weeks: 24 },
      { name: "Collagen Peptides", rating: 4, weeks: 12 },
    ],
    conditions: ["Digestive sensitivity"],
    outcome: "Blood markers improved at 6-month checkup. Joint pain reduced enough to resume hiking. Worth the consistency.",
  },
  {
    id: "4",
    handle: "User_G88R",
    age: 27,
    matchScore: 85,
    sharedGoals: ["Mental Performance", "Energy"],
    topSupplements: [
      { name: "Lion's Mane Mushroom", rating: 5, weeks: 8 },
      { name: "Rhodiola Rosea", rating: 4, weeks: 6 },
      { name: "B-Complex", rating: 4, weeks: 12 },
    ],
    conditions: [],
    outcome: "Cognitive clarity during long study sessions has been consistently better. Energy doesn't crash in the afternoon anymore.",
  },
];

function MatchBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "from-emerald-400 to-teal-500" :
    score >= 80 ? "from-teal-400 to-cyan-500" :
    "from-blue-400 to-indigo-500";
  return (
    <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-bold shadow-sm`}>
      <Sparkles className="w-3 h-3" />
      {score}% Match
    </div>
  );
}

function SimilarUserCard({ user }: { user: SimilarUser }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user.handle.slice(-2)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">{user.handle}</span>
                <span className="text-xs text-gray-400">Age {user.age}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.sharedGoals.map((g) => (
                  <span key={g} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-medium">{g}</span>
                ))}
              </div>
            </div>
          </div>
          <MatchBadge score={user.matchScore} />
        </div>

        {/* Top supplement */}
        <div className="mt-4 p-3.5 bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Top-Rated Stack</p>
          <div className="space-y-2">
            {user.topSupplements.slice(0, expanded ? undefined : 2).map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{s.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`w-3 h-3 ${i <= s.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{s.weeks}w</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outcome quote */}
        <blockquote className="mt-3 text-sm text-gray-600 italic pl-3 border-l-2 border-emerald-300 leading-relaxed">
          "{user.outcome}"
        </blockquote>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium py-1 transition-colors"
        >
          {expanded ? "Show less" : "See full supplement details"}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}

function EmptyProfileState() {
  return (
    <div className="text-center py-14 px-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
        <Target className="w-8 h-8 text-emerald-500" />
      </div>
      <h3 className="font-bold text-gray-900 mb-2">Complete Your Profile</h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
        Fill in your health goals, conditions, and lab data to get matched with users who share your profile and see what's working for them.
      </p>
      <a
        href="/chat"
        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
      >
        Build My Profile
        <ChevronRight className="w-4 h-4" />
      </a>
    </div>
  );
}

function ProfileMatchStats({ matchCount, topGoals }: { matchCount: number; topGoals: string[] }) {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1">
          <p className="text-emerald-100 text-sm font-medium">Your Profile Match</p>
          <p className="text-3xl font-bold mt-1">{matchCount.toLocaleString()}</p>
          <p className="text-emerald-100 text-sm mt-0.5">users with similar health profiles</p>
        </div>
        <div className="text-right">
          <p className="text-emerald-100 text-xs font-medium mb-2">Matched on</p>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {topGoals.map((g) => (
              <span key={g} className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SimilarProfiles() {
  const { profile, isOnboardingComplete } = useHealthProfile();
  const [sortBy, setSortBy] = useState<"match" | "rating">("match");

  const activeGoals = Object.entries(profile.goals)
    .filter(([, v]) => v)
    .map(([k]) => {
      const labels: Record<string, string> = {
        fitness: "Fitness",
        muscleMass: "Muscle Mass",
        strength: "Strength",
        mentalPerformance: "Mental Performance",
        longevity: "Longevity",
        painMitigation: "Pain Mitigation",
      };
      return labels[k] || k;
    });

  const sorted = [...MOCK_SIMILAR_USERS].sort((a, b) =>
    sortBy === "match" ? b.matchScore - a.matchScore : b.topSupplements[0].rating - a.topSupplements[0].rating
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">People Like You</h2>
        <p className="text-sm text-gray-500 mt-1">
          Users with similar health profiles, goals, and conditions — see what's working for them
        </p>
      </div>

      {/* Match stats banner */}
      {isOnboardingComplete && activeGoals.length > 0 && (
        <ProfileMatchStats matchCount={2847} topGoals={activeGoals.slice(0, 3)} />
      )}

      {/* How matching works */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900">How Matching Works</p>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              We cluster users by age range, health goals, medical conditions, and lab data patterns. Match scores are calculated across all profile dimensions. All profiles are anonymized.
            </p>
          </div>
        </div>
      </div>

      {!isOnboardingComplete ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <EmptyProfileState />
        </div>
      ) : (
        <>
          {/* Sort controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by</span>
            {(["match", "rating"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === s ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"}`}
              >
                {s === "match" ? <><Sparkles className="w-3.5 h-3.5" /> Best Match</> : <><TrendingUp className="w-3.5 h-3.5" /> Top Rated</>}
              </button>
            ))}
          </div>

          {/* User cards */}
          <div className="space-y-4">
            {sorted.map((u) => (
              <SimilarUserCard key={u.id} user={u} />
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 pb-2">
            Showing {sorted.length} of 2,847 matched profiles · Updated daily
          </p>
        </>
      )}
    </div>
  );
}
