"use client";

import { useState } from "react";
import AdminGuard from "../auth/components/AdminGuard";
import Header from "./layouts/Header";
import Sidebar from "./layouts/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background-alt text-foreground flex transition-colors">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
          <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />
          <main className="flex-1 p-3 sm:p-4 lg:p-5 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
