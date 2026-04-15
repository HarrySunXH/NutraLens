"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap, Moon, Smile, Activity, CheckCircle2, Plus, Sparkles, Pill } from "lucide-react";
import { useHealthProfile } from "@/context/HealthProfileContext";

interface DailyCheckIn {
  date: string; // YYYY-MM-DD
  energy: number; // 1-5
  mood: number;
  sleep: number;
  symptoms: number; // 1=severe, 5=none
}

const STORAGE_KEY = "nutralens_progress";

function loadCheckIns(): DailyCheckIn[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCheckIns(data: DailyCheckIn[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
}

const METRICS = [
  { key: "energy" as const, label: "Energy", icon: Zap, color: "amber" },
  { key: "mood" as const, label: "Mood", icon: Smile, color: "emerald" },
  { key: "sleep" as const, label: "Sleep", icon: Moon, color: "indigo" },
  { key: "symptoms" as const, label: "Feeling Well", icon: Activity, color: "teal" },
];

const COLOR_MAP: Record<string, { dot: string; bg: string; text: string; fill: string }> = {
  amber:   { dot: "bg-amber-400",   bg: "bg-amber-50",   text: "text-amber-700",   fill: "bg-amber-400" },
  emerald: { dot: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700", fill: "bg-emerald-400" },
  indigo:  { dot: "bg-indigo-400",  bg: "bg-indigo-50",  text: "text-indigo-700",  fill: "bg-indigo-400" },
  teal:    { dot: "bg-teal-400",    bg: "bg-teal-50",    text: "text-teal-700",    fill: "bg-teal-400" },
};

function RatingButtons({
  value,
  onChange,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
            value >= v
              ? `${c.fill} text-white shadow-sm scale-105`
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function MiniBar({ value, color }: { value: number; color: string }) {
  const c = COLOR_MAP[color];
  if (!value) {
    return <div className="w-full h-1.5 rounded-full bg-gray-100" />;
  }
  return (
    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${c.fill} transition-all`}
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
  );
}

function WeekChart({ checkIns }: { checkIns: DailyCheckIn[] }) {
  const days = last7Days();
  const byDate = Object.fromEntries(checkIns.map((c) => [c.date, c]));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-emerald-500" />
        <h3 className="font-bold text-gray-900 text-sm">Last 7 Days</h3>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {days.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium">
            {formatDay(d)}
          </div>
        ))}
      </div>

      {/* Metric rows */}
      {METRICS.map(({ key, label, color }) => {
        const c = COLOR_MAP[color];
        return (
          <div key={key} className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${c.dot}`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => {
                const entry = byDate[d];
                const val = entry ? entry[key] : 0;
                return (
                  <div key={d} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-md transition-all ${val ? c.fill : "bg-gray-100"}`}
                      style={{ height: val ? `${8 + val * 5}px` : "8px", opacity: val ? 0.85 + val * 0.03 : 1 }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-gray-100" />
          <span className="text-xs text-gray-400">No data</span>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <div className="w-2 h-2 rounded bg-emerald-400" />
          <span className="text-xs text-gray-400">Logged</span>
        </div>
      </div>
    </div>
  );
}

function AIInsight({ checkIns, supplements }: { checkIns: DailyCheckIn[]; supplements: string[] }) {
  const recent = checkIns.slice(-3);
  if (recent.length === 0) return null;

  const avgEnergy = recent.reduce((s, c) => s + c.energy, 0) / recent.length;
  const avgMood = recent.reduce((s, c) => s + c.mood, 0) / recent.length;
  const avgSleep = recent.reduce((s, c) => s + c.sleep, 0) / recent.length;

  let insight = "";
  if (avgEnergy >= 4 && avgMood >= 4) {
    insight = "Your energy and mood have been strong recently. Keep your current regimen consistent.";
  } else if (avgSleep < 3) {
    insight = "Your sleep scores are low. Consider timing magnesium or ashwagandha 30–60 min before bed.";
  } else if (avgEnergy < 3) {
    insight = "Energy has been lower than ideal. Check if you're taking B-vitamins or iron consistently.";
  } else {
    insight = "You're tracking consistently — great habit. Continue for at least 2 weeks to spot patterns.";
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-900 mb-0.5">AI Insight</p>
          <p className="text-sm text-emerald-800 leading-relaxed">{insight}</p>
          {supplements.length > 0 && (
            <p className="text-xs text-emerald-600 mt-1.5">
              Based on your {recent.length}-day log and {supplements.length} tracked supplement{supplements.length > 1 ? "s" : ""}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyProgressTab() {
  const { profile, isOnboardingComplete } = useHealthProfile();
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [draft, setDraft] = useState<Omit<DailyCheckIn, "date">>({ energy: 0, mood: 0, sleep: 0, symptoms: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = loadCheckIns();
    setCheckIns(data);
    const today = todayStr();
    if (data.find((c) => c.date === today)) setSubmitted(true);
  }, []);

  const handleSubmit = () => {
    if (!draft.energy || !draft.mood || !draft.sleep || !draft.symptoms) return;
    const today = todayStr();
    const updated = [...checkIns.filter((c) => c.date !== today), { date: today, ...draft }];
    setCheckIns(updated);
    saveCheckIns(updated);
    setSubmitted(true);
  };

  const todayEntry = checkIns.find((c) => c.date === todayStr());
  const supplements = profile.currentSupplements ?? [];

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Health Progress</h2>
        <p className="text-sm text-gray-500 mt-1">
          Log how you feel each day to track how your supplements are working over time.
        </p>
      </div>

      {/* Current supplement stack */}
      {isOnboardingComplete && supplements.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-4 h-4 text-emerald-500" />
            <p className="text-sm font-semibold text-gray-900">Tracking Against Your Stack</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {supplements.map((s) => (
              <span key={s} className="text-xs px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-100">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Daily check-in */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Today's Check-In</h3>
          </div>
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </span>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            {submitted && todayEntry ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold text-sm">Logged for today!</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {METRICS.map(({ key, label, icon: Icon, color }) => {
                    const c = COLOR_MAP[color];
                    const val = todayEntry[key];
                    return (
                      <div key={key} className={`rounded-xl p-3 ${c.bg}`}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icon className={`w-3.5 h-3.5 ${c.text}`} />
                          <span className={`text-xs font-medium ${c.text}`}>{label}</span>
                        </div>
                        <MiniBar value={val} color={color} />
                        <p className={`text-xs mt-1 ${c.text} font-semibold`}>{val}/5</p>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Edit today's entry
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {METRICS.map(({ key, label, icon: Icon, color }) => {
                  const c = COLOR_MAP[color];
                  return (
                    <div key={key}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-md ${c.bg} flex items-center justify-center`}>
                          <Icon className={`w-3.5 h-3.5 ${c.text}`} />
                        </div>
                        <label className="text-sm font-medium text-gray-700">{label}</label>
                        <span className="text-xs text-gray-400 ml-1">
                          {key === "symptoms" ? "(1 = rough, 5 = great)" : "(1 = low, 5 = high)"}
                        </span>
                      </div>
                      <RatingButtons
                        value={draft[key]}
                        onChange={(v) => setDraft((prev) => ({ ...prev, [key]: v }))}
                        color={color}
                      />
                    </div>
                  );
                })}

                <button
                  onClick={handleSubmit}
                  disabled={!draft.energy || !draft.mood || !draft.sleep || !draft.symptoms}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
                >
                  Save Today's Check-In
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 7-day chart */}
      <WeekChart checkIns={checkIns} />

      {/* AI insight */}
      <AIInsight checkIns={checkIns} supplements={supplements} />

      {/* Empty state nudge */}
      {checkIns.length === 0 && (
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            Log at least 3 days to unlock pattern insights and AI feedback.
          </p>
        </div>
      )}
    </div>
  );
}
