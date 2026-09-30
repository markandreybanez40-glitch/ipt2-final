"use client";

import React, { useEffect } from "react";
import { IconX } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileSidebar({ open, onClose, children }: MobileSidebarProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white p-4 shadow-2xl dark:bg-slate-900 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Navigation
          </span>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div onClick={() => onClose()}>{children}</div>
      </div>
    </div>
  );
}
