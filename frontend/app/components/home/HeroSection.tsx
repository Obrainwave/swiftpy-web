import React from "react";
import Image from "next/image";
import { Button } from "../utils/Button";
import { CodeBlock } from "../utils/CodeBlock";
import { RocketIcon, BookIcon, ArrowRightIcon } from "../utils/Icons";
import { HeroBackground } from "./HeroBackground";
import { GradientButton } from "../utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Dynamic Geometric Angled Hero Artwork */}
      <HeroBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Action buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* SwiftPY Brand Logo Header */}
            <div className="flex items-center">
              <Image
                src="/logos/red-black.png"
                alt="SwiftPY"
                width={260}
                height={70}
                priority
                className="h-12 sm:h-16 w-auto object-contain dark:hidden"
              />
              <Image
                src="/logos/red-white.png"
                alt="SwiftPY"
                width={260}
                height={70}
                priority
                className="h-12 sm:h-16 w-auto object-contain hidden dark:block"
              />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-foreground leading-[1.12]">
              The Modern Python{" "}
              <br className="hidden sm:inline" />
              Framework for{" "}
              <span className="relative inline-block text-primary">
                Builders
                {/* Curved underline flourish matching design */}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-secondary overflow-visible"
                  viewBox="0 0 160 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5C45 2.5 115 2 157 8.5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="max-w-xl text-base sm:text-lg text-foreground-muted font-normal leading-relaxed">
              Fast. Powerful. Developer-Friendly. Build modern applications with confidence using SwiftPY.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <GradientButton
                size="md"
                href="/guide"
                leftIcon={<RocketIcon className="w-5 h-5" />}
                rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                className="shadow-md shadow-primary/25"
              >
                Get Started
              </GradientButton>

              <Button
                variant="outline"
                size="md"
                href="/guide"
                leftIcon={<BookIcon className="w-5 h-5 text-foreground/80" />}
                className="font-medium"
              >
                Read the Docs
              </Button>
            </div>
          </div>

          {/* Right Column: Code Editor Showcase */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-lg lg:max-w-none shadow-2xl shadow-orange-950/10 dark:shadow-black/60 rounded-2xl">
              <CodeBlock filename="main.py" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
