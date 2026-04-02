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
    user: "User_4A7F",
    avatar: "U",
    age: 34,
    goals: ["Muscle Mass", "Strength"],
    supplement: "Creatine Monohydrate",
    duration: "3 months",
    rating: 5,
    outcome: "Noticeable strength increase after week 3. Bench press went up by 15 lbs. No bloating with the loading phase skipped. Would highly recommend for anyone in a strength training program.",
    likes: 142,
    comments: 28,
    timestamp: "2 hours ago",
    liked: false,
    tags: ["Strength", "No Side Effects", "Fast Results"],
  },
  {
    id: "2",
    user: "User_9C2E",
    avatar: "U",
    age: 29,
    goals: ["Sleep", "Stress Relief"],
    supplement: "Magnesium Glycinate",
    duration: "6 weeks",
    rating: 5,
    outcome: "Game changer for sleep quality. I fall asleep faster and wake up less groggy. Also noticed my anxiety feels more manageable during high-stress weeks. Took about 2 weeks to feel the difference.",
    likes: 98,
    comments: 14,
    timestamp: "5 hours ago",
    liked: false,
    tags: ["Sleep Quality", "Anxiety Relief", "Gradual Effect"],
  },
  {
    id: "3",
    user: "User_2B8D",
    avatar: "U",
    age: 52,
    goals: ["Longevity", "Joint Health"],
    supplement: "Omega-3 Fish Oil",
    duration: "4 months",
    rating: 4,
    outcome: "Joint stiffness in the mornings has decreased significantly. My doctor noted improved triglyceride levels on my last blood panel. The fishy aftertaste is manageable if taken with meals.",
    likes: 76,
    comments: 9,
    timestamp: "1 day ago",
    liked: false,
    tags: ["Joint Health", "Lab Improvements", "Long-term"],
  },
  {
    id: "4",
    user: "User_7K1M",
    avatar: "U",
    age: 26,
    goals: ["Mental Performance", "Stress Relief"],
    supplement: "Ashwagandha KSM-66",
    duration: "2 months",
    rating: 4,
    outcome: "Clearer head during long study sessions. Cortisol feels lower — less reactive to small stressors. Took a full month before I felt anything, so patience is key. Sleep also improved as a bonus.",
    likes: 63,
    comments: 17,
    timestamp: "2 days ago",
    liked: false,
    tags: ["Focus", "Cortisol", "Slow Onset"],
  },
  {
    id: "5",
    user: "User_3L5P",
    avatar: "U",
    age: 41,
    goals: ["Immunity", "Bone Health"],
    supplement: "Vitamin D3 + K2",
    duration: "5 months",
    rating: 5,
    outcome: "My vitamin D level went from 18 ng/mL to 52 ng/mL in 4 months. Fewer colds this winter. Energy levels in the afternoon feel more stable. The K2 pairing is essential — don't skip it.",
    likes: 201,
    comments: 43,
    timestamp: "3 days ago",
    liked: false,
    tags: ["Lab Verified", "Energy", "Immunity"],
  },
  {
    id: "6",
    user: "User_8Q4R",
    avatar: "U",
    age: 38,
    goals: ["Joint Health", "Skin"],
    supplement: "Collagen Peptides",
    duration: "3 months",
    rating: 4,
    outcome: "Knee pain from running has noticeably decreased. Skin looks more hydrated. Easy to add to coffee in the mornings — no taste. Results are subtle but consistent over time.",
    likes: 55,
    comments: 11,
    timestamp: "4 days ago",
    liked: false,
    tags: ["Joint Recovery", "Skin", "Easy to Use"],
  },
];

const GOAL_OPTIONS = ["All", "Sleep", "Muscle Mass", "Stress Relief", "Mental Performance", "Immunity", "Joint Health", "Longevity", "Skin", "Energy"];
const SUPPLEMENT_OPTIONS = ["All", "Magnesium Glycinate", "Creatine Monohydrate", "Vitamin D3 + K2", "Omega-3 Fish Oil", "Ashwagandha KSM-66", "Collagen Peptides"];

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
