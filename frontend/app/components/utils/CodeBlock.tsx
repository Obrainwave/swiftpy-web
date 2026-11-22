"use client";

import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "./Icons";

export interface CodeBlockProps {
  filename?: string;
  code?: string;
  className?: string;
}

export function CodeBlock({
  filename = "main.py",
  code,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const defaultSnippet = `from swiftpy import Application

app = Application()

@app.get("/")
async def home(request):
    return {"message": "Hello, SwiftPY!"}

if __name__ == "__main__":
    app.run()`;

  const codeToDisplay = code || defaultSnippet;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeToDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl bg-surface text-foreground border border-border shadow-xl overflow-hidden font-mono text-sm ${className}`}
    >
      {/* Window Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-background-alt/60 border-b border-border">
        {/* Window control dots */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>

        {/* Tab / Filename */}
        <div className="px-3 py-1 text-xs font-medium text-foreground bg-surface border border-border/80 rounded-md shadow-2xs">
          {filename}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface rounded-md transition-colors cursor-pointer"
        >
          {copied ? (
            <CheckIcon className="w-4 h-4 text-accent" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Code body with line numbers */}
      <div className="p-4 sm:p-6 overflow-x-auto text-[13px] sm:text-sm leading-relaxed">
        <div className="flex">
          {/* Line numbers */}
          <div className="select-none pr-4 sm:pr-6 text-right text-foreground-muted/40 font-mono text-xs sm:text-sm">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
          </div>

          {/* Syntax Highlighted Code */}
          <div className="flex-1 font-mono">
            <div>
              <span className="text-primary font-semibold">from</span>{" "}
              <span className="text-foreground">swiftpy</span>{" "}
              <span className="text-primary font-semibold">import</span>{" "}
              <span className="text-sky-600 dark:text-sky-400 font-medium">Application</span>
            </div>
            <div className="h-4" />
            <div>
              <span className="text-foreground">app</span> ={" "}
              <span className="text-sky-600 dark:text-sky-400 font-medium">Application</span>()
            </div>
            <div className="h-4" />
            <div>
              <span className="text-secondary font-semibold">@app.get</span>(
              <span className="text-accent font-medium">&quot;/&quot;</span>)
            </div>
            <div>
              <span className="text-primary font-semibold">async def</span>{" "}
              <span className="text-sky-600 dark:text-sky-400 font-medium">home</span>(
              <span className="text-foreground">request</span>):
            </div>
            <div className="pl-6">
              <span className="text-primary font-semibold">return</span> &#123;
              <span className="text-accent font-medium">&quot;message&quot;</span>:{" "}
              <span className="text-accent font-medium">&quot;Hello, SwiftPY!&quot;</span>&#125;
            </div>
            <div className="h-4" />
            <div>
              <span className="text-primary font-semibold">if</span>{" "}
              <span className="text-sky-600 dark:text-sky-400">__name__</span> =={" "}
              <span className="text-accent font-medium">&quot;__main__&quot;</span>:
            </div>
            <div className="pl-6">
              <span className="text-foreground">app.run()</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeBlock;
