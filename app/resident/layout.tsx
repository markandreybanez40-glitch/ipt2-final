"use client";

import React, { useState } from "react";
import { ResidentSidebar } from "@/components/resident/resident-sidebar";
import { ResidentHeader } from "@/components/resident/resident-header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <ResidentSidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <ResidentSidebar />
      </MobileSidebar>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64">
        <ResidentHeader onOpenMobileSidebar={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
