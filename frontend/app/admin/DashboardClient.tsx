"use client";

import React, { useState } from "react";
import {
  CartIcon,
  DollarIcon,
  UserIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../components/utils/Icons";

export default function DashboardPage() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const ideas = [
    {
      title: "Create a Blog Post for your product",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem...",
    },
    {
      title: "Optimize SEO keywords for Python APIs",
      desc: "Discover trending search terms and enhance your framework documentation reach.",
    },
    {
      title: "Launch an automated customer survey",
      desc: "Gather actionable developer feedback on the latest SwiftPY v2.0 feature release.",
    },
  ];

  const currentIdea = ideas[carouselIndex];

  const handleNextIdea = () => {
    setCarouselIndex((prev) => (prev + 1) % ideas.length);
  };

  const handlePrevIdea = () => {
    setCarouselIndex((prev) => (prev - 1 + ideas.length) % ideas.length);
  };

  return (
    <div className="space-y-3 max-w-7xl mx-auto">
      {/* ── TOP ROW: HERO BANNER & IDEAS CARD ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Welcome Greeting Banner (Gradient using system colors: Primary -> Secondary -> Accent) */}
        <div className="lg:col-span-8 rounded-xl sm:rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          {/* Subtle Ambient Mesh Overlays */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 bg-white/15 rounded-full blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 left-1/3 w-48 h-48 bg-black/10 rounded-full blur-xl"
          />

          <div className="relative z-10 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>👋</span>
              <span>Hello Ana,</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed font-medium">
              Welcome to your E-commerce Dashboard! Monitor your sales, track your progress,
              and gain valuable insights.
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs sm:text-sm shadow-md hover:bg-gray-100 hover:shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4 text-secondary" />
              <span>Start AI</span>
            </button>
          </div>
        </div>

        {/* Ideas for You Card */}
        <div className="lg:col-span-4 rounded-xl sm:rounded-2xl p-6 bg-surface border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-foreground-muted tracking-wider uppercase">
              Ideas for You
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevIdea}
                aria-label="Previous idea"
                className="w-7 h-7 rounded-full bg-background-alt border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextIdea}
                aria-label="Next idea"
                className="w-7 h-7 rounded-full bg-background-alt border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="my-4 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              {currentIdea.title}
            </h3>
            <p className="text-xs text-foreground-muted leading-relaxed line-clamp-3">
              {currentIdea.desc}
            </p>
          </div>

          <div>
            <button
              type="button"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-surface border border-border text-foreground hover:bg-background-alt transition-colors cursor-pointer shadow-2xs"
            >
              Read Now
            </button>
          </div>
        </div>
      </div>

      {/* ── MIDDLE ROW: 3 KPI METRIC CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Orders */}
        <div className="rounded-2xl p-6 bg-surface border border-border shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <CartIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-foreground-muted">Orders</span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              5,312
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
              <span>2.29%</span>
              <TrendingUpIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="rounded-2xl p-6 bg-surface border border-border shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <DollarIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-foreground-muted">Revenue</span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              $120,000
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">
              <span>2.19%</span>
              <TrendingUpIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Conversion Rate */}
        <div className="rounded-2xl p-6 bg-surface border border-border shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/15 text-sky-500 flex items-center justify-center shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-foreground-muted">Conversion Rate</span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              3.5%
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              <span>3.19%</span>
              <TrendingDownIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: REVENUE AREA CHART & PRODUCT SALES DONUT CHART ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left Column: Revenue Area Chart */}
        <div className="lg:col-span-8 rounded-xl sm:rounded-2xl p-6 bg-surface border border-border shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Revenue
            </h2>
            {/* Income & Expenses Indicator Box */}
            <div className="flex items-center gap-6 px-4 py-2 rounded-xl bg-background-alt border border-border/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="text-xs text-foreground-muted">Total Income:</span>
                <span className="text-xs sm:text-sm font-extrabold text-foreground">
                  $120,000
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="text-xs text-foreground-muted">Total expenses:</span>
                <span className="text-xs sm:text-sm font-extrabold text-foreground">
                  $198,214
                </span>
              </div>
            </div>
          </div>

          {/* Precision SVG Area Curve Chart */}
          <div className="w-full pt-4 overflow-hidden">
            <div className="relative w-full h-64 sm:h-72">
              <svg
                viewBox="0 0 700 240"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <defs>
                  {/* Accent Green Gradient Fill under the curve */}
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0abd22" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#0abd22" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#0abd22" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="40" y1="30" x2="680" y2="30" stroke="currentColor" className="text-border" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="40" y1="75" x2="680" y2="75" stroke="currentColor" className="text-border" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="40" y1="120" x2="680" y2="120" stroke="currentColor" className="text-border" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="40" y1="165" x2="680" y2="165" stroke="currentColor" className="text-border" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="40" y1="210" x2="680" y2="210" stroke="currentColor" className="text-border" strokeWidth="1" />

                {/* Y-Axis scale labels */}
                <text x="5" y="34" className="text-[10px] fill-foreground-muted font-mono">110k</text>
                <text x="5" y="79" className="text-[10px] fill-foreground-muted font-mono">100k</text>
                <text x="12" y="124" className="text-[10px] fill-foreground-muted font-mono">90k</text>
                <text x="12" y="169" className="text-[10px] fill-foreground-muted font-mono">80k</text>
                <text x="12" y="214" className="text-[10px] fill-foreground-muted font-mono">70k</text>

                {/* Filled Area with system accent green */}
                <path
                  d="M 50,210 L 50,205 Q 160,200 280,195 T 480,185 Q 520,130 560,50 T 660,85 L 660,210 Z"
                  fill="url(#revenueGlow)"
                />

                {/* Curve Stroke Line */}
                <path
                  d="M 50,205 Q 160,200 280,195 T 480,185 Q 520,130 560,50 T 660,85"
                  fill="none"
                  stroke="#0abd22"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points on Peaks matching mockup */}
                {/* Point 1: Peak dot at x=560, y=50 */}
                <circle cx="560" cy="50" r="5" fill="#0abd22" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="560" cy="50" r="9" fill="none" stroke="#0abd22" strokeOpacity="0.4" strokeWidth="2" />

                {/* Point 2: Sub-peak dot at x=660, y=85 */}
                <circle cx="660" cy="85" r="4.5" fill="#0abd22" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Product Sales Donut Chart */}
        <div className="lg:col-span-4 rounded-xl sm:rounded-2xl p-6 bg-surface border border-border shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            Product Sales
          </h2>

          {/* SVG Donut Chart with system color segments */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Segment 1: Green (Accent #0abd22) - 38.1% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#0abd22"
                  strokeWidth="18"
                  strokeDasharray="91 238"
                  strokeDashoffset="0"
                />

                {/* Segment 2: Orange (Secondary #fc7107) - 28.6% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#fc7107"
                  strokeWidth="18"
                  strokeDasharray="68 238"
                  strokeDashoffset="-91"
                />

                {/* Segment 3: Sky Blue (#0ea5e9) - 23.8% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#0ea5e9"
                  strokeWidth="18"
                  strokeDasharray="57 238"
                  strokeDashoffset="-159"
                />

                {/* Segment 4: Red (Primary #e10a06) - 9.5% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#e10a06"
                  strokeWidth="18"
                  strokeDasharray="23 238"
                  strokeDashoffset="-216"
                />
              </svg>

              {/* Center Donut Hole */}
              <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-surface border border-border/60 shadow-inner flex flex-col items-center justify-center text-center">
                <span className="text-[11px] text-foreground-muted font-medium">Total</span>
                <span className="text-sm font-extrabold text-foreground">$58,070</span>
              </div>
            </div>
          </div>

          {/* Donut Legend Breakdown with system colors */}
          <div className="space-y-2.5 pt-2 border-t border-border/80">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
                <span className="text-foreground-muted font-medium">Smartphones</span>
              </div>
              <div className="font-semibold text-foreground">
                $22,120 <span className="text-foreground-muted text-[11px]">(38.1%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
                <span className="text-foreground-muted font-medium">Laptops</span>
              </div>
              <div className="font-semibold text-foreground">
                $16,610 <span className="text-foreground-muted text-[11px]">(28.6%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                <span className="text-foreground-muted font-medium">Accessories</span>
              </div>
              <div className="font-semibold text-foreground">
                $13,820 <span className="text-foreground-muted text-[11px]">(23.8%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                <span className="text-foreground-muted font-medium">Tablets</span>
              </div>
              <div className="font-semibold text-foreground">
                $5,520 <span className="text-foreground-muted text-[11px]">(9.5%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
