"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Bookmark, BookmarkCheck, ChevronRight, Flame, Sparkles, Clock, ArrowRight } from "lucide-react";

interface ListItem {
  rank: number;
  name: string;
  brand: string;
  score: number;
  reviews: number;
  badge?: string;
  reason: string;
}

interface SupplementList {
  id: string;
  title: string;
  subtitle: string;
  category: "featured" | "goal" | "trending" | "expert";
  emoji: string;
  gradient: string;
  updatedAt: string;
  saves: number;
  items: ListItem[];
}

const LISTS: SupplementList[] = [
  {
    id: "best-sleep",
    title: "Top 5 for Better Sleep",
    subtitle: "Highest-rated supplements for sleep quality and duration, based on 3,200+ reviews",
    category: "goal",
    emoji: "🌙",
    gradient: "from-indigo-500 to-purple-600",
    updatedAt: "Updated 2 days ago",
    saves: 1842,
    items: [
      { rank: 1, name: "Magnesium Glycinate", brand: "Thorne Research", score: 4.8, reviews: 1243, badge: "Community Pick", reason: "Fastest onset, minimal side effects, high bioavailability" },
      { rank: 2, name: "L-Theanine", brand: "NOW Foods", score: 4.6, reviews: 876, reason: "Promotes relaxation without drowsiness, stacks well with other sleep aids" },
      { rank: 3, name: "Ashwagandha KSM-66", brand: "Jarrow Formulas", score: 4.5, reviews: 832, reason: "Reduces cortisol levels that disrupt sleep cycles" },
      { rank: 4, name: "Melatonin 0.5mg", brand: "Life Extension", score: 4.4, reviews: 654, badge: "Low Dose", reason: "Lower dose outperforms higher doses for most users in community data" },
      { rank: 5, name: "Apigenin", brand: "Swanson", score: 4.2, reviews: 312, reason: "Emerging favorite — users report deeper, more restorative sleep" },
    ],
  },
  {
    id: "muscle-strength",
    title: "Top 5 for Muscle & Strength",
    subtitle: "Evidence-backed picks for building muscle and increasing strength output",
    category: "goal",
    emoji: "💪",
    gradient: "from-orange-500 to-red-500",
    updatedAt: "Updated 1 day ago",
    saves: 2310,
    items: [
      { rank: 1, name: "Creatine Monohydrate", brand: "Optimum Nutrition", score: 4.9, reviews: 2108, badge: "Most Researched", reason: "Most evidence-backed supplement for strength and power output" },
      { rank: 2, name: "Whey Protein Isolate", brand: "Dymatize", score: 4.7, reviews: 1890, reason: "Fastest absorption post-workout, high leucine content triggers MPS" },
      { rank: 3, name: "Beta-Alanine", brand: "NOW Sports", score: 4.4, reviews: 743, reason: "Reduces muscle fatigue, extends time to exhaustion in high-rep sets" },
      { rank: 4, name: "Citrulline Malate", brand: "BulkSupplements", score: 4.3, reviews: 601, badge: "Best Value", reason: "Enhances blood flow and reduces soreness — underrated by community" },
      { rank: 5, name: "Vitamin D3 + K2", brand: "Life Extension", score: 4.3, reviews: 987, reason: "Low vitamin D strongly correlated with reduced testosterone and strength" },
    ],
  },
  {
    id: "brain-focus",
    title: "Top 5 for Mental Performance",
    subtitle: "Community-curated nootropic stack for focus, memory, and cognitive clarity",
    category: "goal",
    emoji: "🧠",
    gradient: "from-teal-500 to-cyan-500",
    updatedAt: "Updated 3 days ago",
    saves: 1567,
    items: [
      { rank: 1, name: "Lion's Mane Mushroom", brand: "Host Defense", score: 4.7, reviews: 689, badge: "Rising Star", reason: "NGF stimulation linked to memory and long-term cognitive support" },
      { rank: 2, name: "Rhodiola Rosea", brand: "Gaia Herbs", score: 4.5, reviews: 521, reason: "Reduces mental fatigue during high cognitive load — popular with students" },
      { rank: 3, name: "Alpha-GPC", brand: "NOW Foods", score: 4.5, reviews: 448, reason: "Directly raises acetylcholine; users report sharper focus within hours" },
      { rank: 4, name: "L-Theanine + Caffeine", brand: "Nutricost", score: 4.4, reviews: 912, badge: "Starter Pick", reason: "Classic combo — smooth energy without the jitter crash" },
      { rank: 5, name: "Bacopa Monnieri", brand: "Jarrow Formulas", score: 4.1, reviews: 387, reason: "Long-term memory consolidation — requires 6–8 weeks of consistent use" },
    ],
  },
  {
    id: "longevity",
    title: "Top 5 for Longevity",
    subtitle: "Supplements with the strongest evidence for healthspan extension",
    category: "featured",
    emoji: "⏳",
    gradient: "from-emerald-500 to-teal-600",
    updatedAt: "Updated 5 days ago",
    saves: 1123,
    items: [
      { rank: 1, name: "NMN (500mg)", brand: "ProHealth Longevity", score: 4.6, reviews: 543, badge: "Science-Backed", reason: "NAD+ precursor tied to mitochondrial function and cellular repair" },
      { rank: 2, name: "Omega-3 Fish Oil", brand: "Nordic Naturals", score: 4.6, reviews: 1567, reason: "Reduces systemic inflammation — the single strongest correlate of longevity markers" },
      { rank: 3, name: "Resveratrol", brand: "Life Extension", score: 4.2, reviews: 412, reason: "SIRT1 activator; stacks with NMN for synergistic NAD+ effect" },
      { rank: 4, name: "Vitamin D3 + K2", brand: "Life Extension", score: 4.7, reviews: 987, badge: "Lab Verified", reason: "Deficiency independently associated with all-cause mortality in large cohorts" },
      { rank: 5, name: "Coenzyme Q10", brand: "Jarrow Formulas", score: 4.3, reviews: 644, reason: "Essential for ATP production; supplementation becomes critical after 40" },
    ],
  },
  {
    id: "trending-now",
    title: "Trending This Month",
    subtitle: "Fastest-growing supplements in community reviews over the past 30 days",
    category: "trending",
    emoji: "🔥",
    gradient: "from-amber-400 to-orange-500",
    updatedAt: "Updated today",
    saves: 3041,
    items: [
      { rank: 1, name: "Creatine Monohydrate", brand: "Multiple brands", score: 4.8, reviews: 2108, badge: "+34% reviews", reason: "Viral on social media — new users flooding in after broad wellness coverage" },
      { rank: 2, name: "Apigenin", brand: "Swanson / Bulk", score: 4.2, reviews: 312, badge: "+89% reviews", reason: "Exploding in sleep optimization communities after podcast mentions" },
      { rank: 3, name: "Magnesium Threonate", brand: "Life Extension", score: 4.4, reviews: 489, badge: "+52% reviews", reason: "Brain-penetrating form of magnesium gaining traction in nootropic circles" },
      { rank: 4, name: "NMN", brand: "ProHealth", score: 4.6, reviews: 543, badge: "+41% reviews", reason: "Longevity research buzz driving significant new review volume" },
      { rank: 5, name: "Tudca", brand: "Double Wood", score: 4.1, reviews: 198, badge: "+120% reviews", reason: "Liver health and gut barrier support — emerging category breakout" },
    ],
  },
  {
    id: "budget-picks",
    title: "Best Value Picks Under $30",
    subtitle: "Highest effectiveness-to-cost ratio according to community ratings",
    category: "featured",
    emoji: "💰",
    gradient: "from-green-500 to-emerald-600",
    updatedAt: "Updated 1 week ago",
    saves: 987,
    items: [
      { rank: 1, name: "Creatine Monohydrate", brand: "BulkSupplements", score: 4.9, reviews: 2108, badge: "~$12/mo", reason: "Most evidence per dollar of any supplement — unmatched value" },
      { rank: 2, name: "Vitamin D3 + K2", brand: "Sports Research", score: 4.6, reviews: 987, badge: "~$14/mo", reason: "Addresses one of the most common deficiencies at minimal cost" },
      { rank: 3, name: "Magnesium Glycinate", brand: "NOW Foods", score: 4.7, reviews: 1100, badge: "~$18/mo", reason: "Generic brands perform identically to premium — huge savings opportunity" },
      { rank: 4, name: "Omega-3 Fish Oil", brand: "Costco Kirkland", score: 4.4, reviews: 820, badge: "~$20/mo", reason: "Bulk purchasing cuts cost without sacrificing third-party tested quality" },
      { rank: 5, name: "Zinc + Copper", brand: "NOW Foods", score: 4.3, reviews: 445, badge: "~$8/mo", reason: "Foundational mineral pair — essential for testosterone, immune, and thyroid function" },
    ],
  },
];

const CATEGORY_LABELS: Record<SupplementList["category"], string> = {
  featured: "Featured",
  goal: "By Goal",
  trending: "Trending",
  expert: "Expert Pick",
};

const CATEGORY_FILTERS = ["All", "Featured", "By Goal", "Trending"] as const;

function RankBadge({ rank }: { rank: number }) {
  const styles =
    rank === 1 ? "bg-amber-400 text-white" :
    rank === 2 ? "bg-gray-400 text-white" :
    rank === 3 ? "bg-amber-700 text-white" :
    "bg-gray-100 text-gray-500";
  return (
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${styles}`}>
      {rank}
    </div>
  );
}

function ListCard({ list, onSave, saved }: { list: SupplementList; saved: boolean; onSave: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Card header */}
      <div className={`bg-gradient-to-r ${list.gradient} p-5 text-white`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{list.emoji}</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">{list.title}</h3>
              <p className="text-white/80 text-xs mt-1 leading-relaxed">{list.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => onSave(list.id)}
            className="flex-shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {saved
              ? <BookmarkCheck className="w-4 h-4 text-white fill-white" />
              : <Bookmark className="w-4 h-4 text-white" />
            }
          </button>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-white/70">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{list.updatedAt}</span>
          <span className="flex items-center gap-1"><Bookmark className="w-3 h-3" />{list.saves.toLocaleString()} saves</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 font-medium">{CATEGORY_LABELS[list.category]}</span>
        </div>
      </div>

      {/* Preview: top 3 items */}
      <div className="p-4 space-y-3">
        {list.items.slice(0, expanded ? list.items.length : 3).map((item) => (
          <motion.div
            key={item.rank}
            layout
            className="flex items-start gap-3"
          >
            <RankBadge rank={item.rank} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">{item.badge}</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.reason}</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-gray-700">{item.score.toFixed(1)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expand / collapse */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-100 text-sm text-gray-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all"
        >
          {expanded ? (
            <>Show less</>
          ) : (
            <><ArrowRight className="w-4 h-4" /> See all {list.items.length} picks</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function CommunityLists() {
  const [filter, setFilter] = useState<typeof CATEGORY_FILTERS[number]>("All");
  const [savedLists, setSavedLists] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedLists((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = LISTS.filter((l) => {
    if (filter === "All") return true;
    return CATEGORY_LABELS[l.category] === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Curated Lists</h2>
          <p className="text-sm text-gray-500 mt-1">
            Community-built and editor-featured supplement lists for every goal
          </p>
        </div>
        {savedLists.size > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
            <BookmarkCheck className="w-4 h-4" />
            {savedLists.size} saved
          </span>
        )}
      </div>

      {/* Featured banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-emerald-900 text-sm">Editor&rsquo;s Pick This Week</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            <span className="font-medium">Top 5 for Longevity</span> — our most-saved list, updated with new clinical data
          </p>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById("list-longevity");
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex-shrink-0"
        >
          View <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Trending strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 flex-shrink-0">
          <Flame className="w-3.5 h-3.5" /> Trending:
        </div>
        {["Creatine", "Apigenin", "NMN", "Magnesium Threonate", "Tudca"].map((name) => (
          <span key={name} className="flex-shrink-0 text-xs px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full font-medium">
            {name}
          </span>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lists grid */}
      <div className="space-y-5">
        {filtered.map((list) => (
          <div key={list.id} id={`list-${list.id}`}>
            <ListCard list={list} saved={savedLists.has(list.id)} onSave={toggleSave} />
          </div>
        ))}
      </div>
    </div>
  );
}
