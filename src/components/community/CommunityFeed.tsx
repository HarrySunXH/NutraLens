"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, MessageCircle, Star, Clock, Plus, X, ChevronDown } from "lucide-react";

interface Outcome {
  id: string;
  user: string;
  avatar: string;
  age: number;
  goals: string[];
  supplement: string;
  duration: string;
  rating: number;
  outcome: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
  tags: string[];
}

const MOCK_OUTCOMES: Outcome[] = [
  {
    id: "1",
    user: "User_7M2T",
    avatar: "U",
    age: 35,
    goals: ["Weight Management", "Appetite Control"],
    supplement: "Berberine",
    duration: "3 months",
    rating: 5,
    outcome: "This actually helped with cravings in a way I didn't expect. Blood sugar stayed more stable throughout the day, which stopped the 3pm crash-and-snack cycle completely. Lost 8 lbs over 3 months without changing much else. Take it before meals — that timing made a huge difference.",
    likes: 163,
    comments: 31,
    timestamp: "2 hours ago",
    liked: false,
    tags: ["Blood Sugar", "Appetite Control", "Evidence-Backed"],
  },
  {
    id: "2",
    user: "User_5R4L",
    avatar: "U",
    age: 28,
    goals: ["Appetite Control", "Weight Management"],
    supplement: "Glucomannan",
    duration: "6 weeks",
    rating: 4,
    outcome: "The fiber bulk actually works if you take it correctly. 30 minutes before meals with a big glass of water and you'll eat noticeably less. No stimulant effects at all — which I preferred over fat burners that made me anxious. Only downside: you have to remember every meal.",
    likes: 94,
    comments: 19,
    timestamp: "5 hours ago",
    liked: false,
    tags: ["Appetite Suppression", "No Stimulants", "Fiber-Based"],
  },
  {
    id: "3",
    user: "User_3K9W",
    avatar: "U",
    age: 31,
    goals: ["Weight Management", "Energy"],
    supplement: "L-Carnitine",
    duration: "2 months",
    rating: 3,
    outcome: "Tried it hoping for noticeable fat loss but the effect was subtle at best. Energy during workouts felt slightly better, which helped me stay consistent. Didn't see dramatic results on its own — I think the marketing overpromises. Works better as a support supplement when you're already in a calorie deficit.",
    likes: 87,
    comments: 22,
    timestamp: "1 day ago",
    liked: false,
    tags: ["Subtle Effect", "Workout Energy", "Works Best With Diet"],
  },
  {
    id: "4",
    user: "User_9H6B",
    avatar: "U",
    age: 38,
    goals: ["Energy", "Hormone Balance", "Weight Management"],
    supplement: "Vitamin D3",
    duration: "4 months",
    rating: 5,
    outcome: "Got my blood panel done and was severely deficient at 14 ng/mL. Started 5,000 IU daily and within 6 weeks energy improved dramatically — I didn't realize how much the deficiency was affecting me. Also lost weight more easily once my levels normalized. Always get tested before guessing your dose.",
    likes: 178,
    comments: 36,
    timestamp: "2 days ago",
    liked: false,
    tags: ["Lab Verified", "Energy", "Hormone Support"],
  },
  {
    id: "5",
    user: "User_6D3S",
    avatar: "U",
    age: 26,
    goals: ["Weight Management", "Appetite Control"],
    supplement: "Whey Protein Isolate",
    duration: "3 months",
    rating: 5,
    outcome: "Protein is the most underrated weight management tool. A shake after workouts kept me full for 3+ hours and helped me hit 120g protein daily without overeating calories. Maintained muscle while losing fat — body recomp actually works when protein is high enough. Way more effective than any fat burner I tried.",
    likes: 212,
    comments: 44,
    timestamp: "3 days ago",
    liked: false,
    tags: ["Satiety", "Muscle Retention", "High Protein"],
  },
  {
    id: "6",
    user: "User_1P8C",
    avatar: "U",
    age: 33,
    goals: ["Weight Management", "Energy"],
    supplement: "Green Tea Extract (EGCG)",
    duration: "8 weeks",
    rating: 3,
    outcome: "More of a slow burn than a dramatic effect. Slight boost in metabolism and steady energy without the crash you get from stronger stimulants. Not a weight loss supplement on its own — think of it as a 5–10% metabolic nudge while you do everything else right. Good for people who want something mild.",
    likes: 58,
    comments: 11,
    timestamp: "4 days ago",
    liked: false,
    tags: ["Mild Stimulant", "Metabolic Support", "Long-term"],
  },
];

const GOAL_OPTIONS = ["All", "Weight Management", "Appetite Control", "Energy", "Hormone Balance", "Sleep", "Stress Relief"];
const SUPPLEMENT_OPTIONS = ["All", "Berberine", "Glucomannan", "L-Carnitine", "Vitamin D3", "Whey Protein Isolate", "Green Tea Extract (EGCG)"];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

function OutcomeCard({ outcome: o, onLike }: { outcome: Outcome; onLike: (id: string) => void }) {
  const [showFull, setShowFull] = useState(false);
  const isLong = o.outcome.length > 180;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {o.user.slice(-2)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{o.user}</span>
              <span className="text-xs text-gray-400">Age {o.age}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {o.goals.map((g) => (
                <span key={g} className="text-xs px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-medium">{g}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
          <Clock className="w-3.5 h-3.5" />
          {o.timestamp}
        </div>
      </div>

      {/* Supplement info */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">{o.supplement}</p>
          <p className="text-xs text-gray-500 mt-0.5">Used for {o.duration}</p>
        </div>
        <StarRow rating={o.rating} />
      </div>

      {/* Outcome text */}
      <div>
        <p className={`text-sm text-gray-700 leading-relaxed ${!showFull && isLong ? "line-clamp-3" : ""}`}>
          {o.outcome}
        </p>
        {isLong && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 mt-1 font-medium"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFull ? "rotate-180" : ""}`} />
            {showFull ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {o.tags.map((t) => (
          <span key={t} className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full">{t}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1 border-t border-gray-50">
        <button
          onClick={() => onLike(o.id)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${o.liked ? "text-emerald-600 font-medium" : "text-gray-500 hover:text-emerald-600"}`}
        >
          <ThumbsUp className={`w-4 h-4 ${o.liked ? "fill-emerald-500" : ""}`} />
          {o.likes + (o.liked ? 1 : 0)} Helpful
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <MessageCircle className="w-4 h-4" />
          {o.comments}
        </button>
      </div>
    </motion.div>
  );
}

function SubmitModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    supplement: "",
    duration: "",
    rating: 0,
    outcome: "",
    tags: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);

  const TAG_OPTIONS = ["Fast Results", "Gradual Effect", "No Side Effects", "Lab Verified", "Energy Boost", "Sleep Quality", "Focus", "Easy to Use", "Value for Money"];

  const toggleTag = (t: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(t) ? prev.tags.filter((x) => x !== t) : [...prev.tags, t],
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(onClose, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">Share Your Outcome</h3>
            <p className="text-xs text-gray-500 mt-0.5">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-emerald-500 fill-emerald-500" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Review Submitted!</h4>
              <p className="text-sm text-gray-500">Thanks for helping the community.</p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplement Name</label>
                <input
                  value={form.supplement}
                  onChange={(e) => setForm({ ...form, supplement: e.target.value })}
                  placeholder="e.g. Magnesium Glycinate"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">How long did you use it?</label>
                <select
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select duration</option>
                  {["1–2 weeks", "3–4 weeks", "1–2 months", "3–6 months", "6+ months"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, rating: s })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star className={`w-8 h-8 ${s <= form.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <button
                disabled={!form.supplement || !form.duration || form.rating === 0}
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                Next
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Describe your experience</label>
                <textarea
                  value={form.outcome}
                  onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                  placeholder="What did you notice? How long until effects? Any side effects?"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.outcome.length}/500</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${form.tags.includes(t) ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  disabled={form.outcome.length < 20}
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-teal-600 transition-all"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CommunityFeed() {
  const [outcomes, setOutcomes] = useState<Outcome[]>(MOCK_OUTCOMES);
  const [filterGoal, setFilterGoal] = useState("All");
  const [filterSupplement, setFilterSupplement] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const handleLike = (id: string) => {
    setOutcomes((prev) => prev.map((o) => (o.id === id ? { ...o, liked: !o.liked } : o)));
  };

  const filtered = outcomes.filter((o) => {
    const goalOk = filterGoal === "All" || o.goals.includes(filterGoal);
    const suppOk = filterSupplement === "All" || o.supplement === filterSupplement;
    return goalOk && suppOk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Community Outcomes</h2>
          <p className="text-sm text-gray-500 mt-1">Real experiences from verified users with similar health profiles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Share Outcome
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Filter by Goal</p>
          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => setFilterGoal(g)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterGoal === g ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Filter by Supplement</p>
          <div className="flex flex-wrap gap-2">
            {SUPPLEMENT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setFilterSupplement(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterSupplement === s ? "bg-teal-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No outcomes match the selected filters.</div>
        ) : (
          filtered.map((o) => <OutcomeCard key={o.id} outcome={o} onLike={handleLike} />)
        )}
      </div>

      {/* Submit modal */}
      <AnimatePresence>
        {showModal && <SubmitModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
