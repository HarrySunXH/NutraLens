"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, MessageSquare, Users, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import SupplementRankings from "@/components/community/SupplementRankings";
import CommunityFeed from "@/components/community/CommunityFeed";
import SimilarProfiles from "@/components/community/SimilarProfiles";
import CommunityLists from "@/components/community/CommunityLists";
import { HealthProfileProvider } from "@/context/HealthProfileContext";
import Cart from "@/components/Cart";

const TABS = [
  {
    id: "lists",
    label: "Lists",
    icon: List,
    description: "Curated Top 5 lists by goal, trend, and value",
  },
  {
    id: "rankings",
    label: "Rankings",
    icon: Award,
    description: "Top-rated supplements ranked by the community",
  },
  {
    id: "feed",
    label: "Community Feed",
    icon: MessageSquare,
    description: "Real outcomes shared by verified users",
  },
  {
    id: "similar",
    label: "People Like You",
    icon: Users,
    description: "Matched users with similar health profiles",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

function CommunityPageContent() {
  const [activeTab, setActiveTab] = useState<TabId>("lists");

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/20">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Community</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Supplement Intelligence,<br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Powered by the Community
            </span>
          </h1>
          <p className="mt-3 text-gray-500 leading-relaxed">
            Explore crowd-sourced supplement rankings, read real outcomes from users who share your health goals, and discover what's working for people just like you.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { label: "Reviews", value: "8,400+" },
            { label: "Supplements Ranked", value: "320+" },
            { label: "Active Users", value: "14,200+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 text-center shadow-sm">
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-8 flex gap-1"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-xl bg-emerald-50"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                <span className="relative z-10 sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab description */}
        <motion.p
          key={`desc-${activeTab}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-gray-500 mb-6 flex items-center gap-2"
        >
          <currentTab.icon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          {currentTab.description}
        </motion.p>

        {/* Tab content */}
        <motion.div
          key={`content-${activeTab}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "rankings" && <SupplementRankings />}
          {activeTab === "feed" && <CommunityFeed />}
          {activeTab === "similar" && <SimilarProfiles />}
          {activeTab === "lists" && <CommunityLists />}
        </motion.div>
      </div>

      <Cart />
    </div>
  );
}

export default function CommunityPage() {
  return (
    <HealthProfileProvider>
      <CommunityPageContent />
    </HealthProfileProvider>
  );
}
