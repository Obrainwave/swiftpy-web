"use client";

import React, { useState } from "react";
import { SearchIcon } from "./Icons";

export interface SearchBarProps {
  placeholder?: string;
  shortcut?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search documentation...",
  shortcut = "Ctrl + K",
  onSearch,
  className = "",
}: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div
      className={`relative flex items-center w-full max-w-sm sm:max-w-md transition-all ${className}`}
    >
      <div className="absolute left-3.5 flex items-center pointer-events-none text-foreground-muted">
        <SearchIcon className="w-4 h-4" />
      </div>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-16 py-2 text-xs sm:text-sm bg-background-alt/80 hover:bg-background-alt focus:bg-surface text-foreground placeholder:text-foreground-muted border border-border/80 rounded-full outline-hidden focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
      />
      {shortcut && (
        <div className="absolute right-3 flex items-center pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-foreground-muted bg-surface dark:bg-background-alt border border-border rounded shadow-2xs">
            {shortcut}
          </kbd>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
