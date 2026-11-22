import React from "react";
import Image from "next/image";
import { Button } from "../utils/Button";
import { ArrowRightIcon } from "../utils/Icons";

export function CommunityBanner() {
  return (
    <section className="py-8 sm:py-12 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0d132c] text-white shadow-xl min-h-[140px] flex items-center">
          {/* Mountain Silhouette Background Artwork */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-0 opacity-70 select-none overflow-hidden"
          >
            {/* Sunset mountain gradient behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d132c] via-[#1a1738] to-[#2a1728]" />
            <div className="absolute bottom-0 right-0 w-3/4 h-full bg-gradient-to-t from-red-600/20 via-orange-500/10 to-transparent" />
            
            {/* Mountain Peaks SVG */}
            <svg
              className="absolute bottom-0 left-0 right-0 w-full h-24 sm:h-32 object-cover"
              viewBox="0 0 1200 200"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back Mountain Ridge (reddish sunset tint) */}
              <polygon
                points="0,200 150,140 320,170 500,90 650,150 780,100 950,160 1100,120 1200,150 1200,200"
                fill="#3d1b32"
                opacity="0.6"
              />
              <polygon
                points="450,200 620,80 750,160 920,70 1080,150 1200,110 1200,200"
                fill="#591c28"
                opacity="0.4"
              />
              {/* Mid Ridge with sunset rim highlight */}
              <polygon
                points="0,200 180,160 380,120 540,165 710,115 880,170 1020,130 1200,175 1200,200"
                fill="#18132f"
                opacity="0.9"
              />
              {/* Foreground dark peaks */}
              <polygon
                points="0,200 120,175 280,150 460,185 620,135 790,180 980,155 1140,185 1200,170 1200,200"
                fill="#0b0f22"
              />
            </svg>
          </div>

          {/* Banner Content */}
          <div className="relative z-10 w-full px-6 py-6 sm:px-10 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Brand Mark + Separator + Headline */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="shrink-0 flex items-center justify-center">
                <Image
                  src="/logos/red-white.png"
                  alt="SwiftPY"
                  width={110}
                  height={32}
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-[1px] h-10 bg-white/20" />

              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Join the SwiftPY Community
                </h3>
                <p className="text-xs sm:text-sm text-white/75 font-normal">
                  Get help, share ideas, and be part of our growing community.
                </p>
              </div>
            </div>

            {/* Right: Join CTA Button */}
            <div className="shrink-0">
              <Button
                variant="secondary"
                size="md"
                href="/community"
                rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                className="bg-gradient-to-r from-secondary to-[#e64a05] hover:brightness-110 shadow-lg text-white font-semibold px-6 py-2.5 rounded-full"
              >
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommunityBanner;
