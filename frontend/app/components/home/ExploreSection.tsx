import React from "react";
import Link from "next/link";
import { GuideCard } from "../utils/GuideCard";
import {
  RocketIcon,
  LayersIcon,
  BookIcon,
  CodeIcon,
  ArrowRightIcon,
} from "../utils/Icons";

const GUIDES = [
  {
    icon: <RocketIcon className="w-6 h-6 text-primary" />,
    title: "Get Started Quickly",
    description: "Install SwiftPY and create your first application in minutes.",
    linkLabel: "Installation Guide",
    href: "/guide",
    linkColor: "primary" as const,
  },
  {
    icon: <LayersIcon className="w-6 h-6 text-secondary" />,
    title: "Explore the Features",
    description: "Discover routing, ORM, events, queues and more.",
    linkLabel: "Core Concepts",
    href: "/guide",
    linkColor: "secondary" as const,
  },
  {
    icon: <BookIcon className="w-6 h-6 text-primary" />,
    title: "Browse Examples",
    description: "See real-world examples and complete projects.",
    linkLabel: "Examples",
    href: "/examples",
    linkColor: "primary" as const,
  },
  {
    icon: <CodeIcon className="w-6 h-6 text-secondary" />,
    title: "Dive into the API",
    description: "Get detailed API reference and advanced usage.",
    linkLabel: "API Reference",
    href: "/api-reference",
    linkColor: "secondary" as const,
  },
];

export function ExploreSection() {
  return (
    <section className="py-12 sm:py-16 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Explore SwiftPY
          </h2>
          <Link
            href="/guide"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <span>View all guides</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GUIDES.map((guide) => (
            <GuideCard
              key={guide.title}
              icon={guide.icon}
              title={guide.title}
              description={guide.description}
              linkLabel={guide.linkLabel}
              href={guide.href}
              linkColor={guide.linkColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExploreSection;
