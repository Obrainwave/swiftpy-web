import React from "react";

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Dynamic SVG Geometric Hero Artwork */}
      <svg
        className="absolute top-0 right-0 w-full h-[650px] sm:h-[750px] lg:h-[820px] object-cover"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="xMaxYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Primary Fiery Wedge Gradient */}
          <linearGradient
            id="heroMainWedge"
            x1="1440"
            y1="0"
            x2="800"
            y2="550"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#fc7107" />
            <stop offset="25%" stopColor="#ff5504" />
            <stop offset="55%" stopColor="#e10a06" />
            <stop offset="85%" stopColor="#fa4405" />
            <stop offset="100%" stopColor="#ff851b" />
          </linearGradient>

          {/* Secondary Soft Ambient Diagonal Band */}
          <linearGradient
            id="heroSoftBand"
            x1="1300"
            y1="50"
            x2="650"
            y2="600"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#fc7107" stopOpacity="0.32" />
            <stop offset="45%" stopColor="#ff5c00" stopOpacity="0.18" />
            <stop offset="80%" stopColor="#e10a06" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Third Outer Glow Band */}
          <linearGradient
            id="heroOuterGlow"
            x1="1440"
            y1="100"
            x2="500"
            y2="700"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ff8a00" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#ff3d00" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Crisp Diagonal Edge Beam Highlight */}
          <linearGradient
            id="heroEdgeHighlight"
            x1="880"
            y1="0"
            x2="1440"
            y2="420"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#ffd8be" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#ff7b39" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#e10a06" stopOpacity="0" />
          </linearGradient>

          {/* Dark Mode Main Wedge */}
          <linearGradient
            id="heroDarkWedge"
            x1="1440"
            y1="0"
            x2="850"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#e10a06" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#fc7107" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#9e0704" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#090d16" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── LIGHT MODE ARTWORK ── */}
        <g className="dark:hidden">
          {/* Layer 1: Wide Soft Warm Ambiance */}
          <polygon
            points="580,0 1440,0 1440,780 820,720 540,460"
            fill="url(#heroOuterGlow)"
          />

          {/* Layer 2: Intermediate Diagonal Sweep (behind code card) */}
          <polygon
            points="760,0 1440,0 1440,640 1020,620 720,380"
            fill="url(#heroSoftBand)"
          />

          {/* Layer 3: Main Saturated Bold Wedge at Top-Right */}
          <polygon
            points="890,0 1440,0 1440,480 1180,440"
            fill="url(#heroMainWedge)"
          />

          {/* Layer 4: Accent Speed Slices (echoing the SwiftPY bird speed feathers) */}
          <polygon
            points="990,0 1120,0 1440,320 1440,240"
            fill="#ffffff"
            opacity="0.18"
          />
          <polygon
            points="1180,0 1280,0 1440,160 1440,100"
            fill="#ffffff"
            opacity="0.22"
          />

          {/* Layer 5: Sharp Luminous Dividing Edge */}
          <line
            x1="890"
            y1="0"
            x2="1440"
            y2="480"
            stroke="url(#heroEdgeHighlight)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* ── DARK MODE ARTWORK ── */}
        <g className="hidden dark:block">
          {/* Layer 1: Dark atmospheric glow */}
          <polygon
            points="650,0 1440,0 1440,700 850,680"
            fill="url(#heroOuterGlow)"
            opacity="0.4"
          />

          {/* Layer 2: Rich Cyber-Ember Wedge */}
          <polygon
            points="890,0 1440,0 1440,500 1150,460"
            fill="url(#heroDarkWedge)"
          />

          {/* Layer 3: Luminous cyber edge */}
          <line
            x1="890"
            y1="0"
            x2="1440"
            y2="500"
            stroke="#fc7107"
            strokeOpacity="0.4"
            strokeWidth="2"
          />
        </g>
      </svg>

      {/* Atmospheric radial blend for soft edge integration */}
      <div className="absolute top-0 right-0 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-gradient-to-b from-orange-400/20 via-red-500/10 to-transparent blur-3xl opacity-70 pointer-events-none dark:opacity-30" />
    </div>
  );
}

export default HeroBackground;
