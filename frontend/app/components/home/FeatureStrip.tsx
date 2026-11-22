import React from "react";
import { FeatureCard } from "../utils/FeatureCard";
import { ZapIcon, BoxIcon, PuzzleIcon, ShieldIcon } from "../utils/Icons";

const FEATURES = [
  {
    icon: <ZapIcon className="w-6 h-6 text-orange-500" />,
    title: "Blazing Fast",
    description: "Async-first architecture for peak performance.",
  },
  {
    icon: <BoxIcon className="w-6 h-6 text-orange-500" />,
    title: "Full-Stack Ready",
    description: "Web, database, events, and more out of the box.",
  },
  {
    icon: <PuzzleIcon className="w-6 h-6 text-orange-500" />,
    title: "Extensible",
    description: "A modular design for unlimited possibilities.",
  },
  {
    icon: <ShieldIcon className="w-6 h-6 text-orange-500" />,
    title: "Secure by Design",
    description: "Built with security best practices.",
  },
];

export function FeatureStrip() {
  return (
    <section className="py-6 sm:py-10 border-y border-border/60 bg-background-alt/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureStrip;
