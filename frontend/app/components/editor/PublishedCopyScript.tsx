"use client";

import { useEffect } from "react";

export default function PublishedCopyScript() {
  useEffect(() => {
    const handleClick = async (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
        "[data-copy-code]"
      );
      if (!button) return;
      const code = button.closest("[data-code-block]")?.getAttribute("data-code");
      if (!code) return;
      await navigator.clipboard.writeText(code);
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1500);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
