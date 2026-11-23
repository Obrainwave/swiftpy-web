"use client";

import React, { useState } from "react";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import AdminGuard from "../auth/components/AdminGuard";

export default function AdminOverall({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background-alt text-foreground flex transition-colors">
        {/* Collapsible Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Admin Content Container */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-3 sm:p-4 lg:p-5 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
