"use client";

import React, { useEffect, useState } from "react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { mockAdminUser } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types/user";

export interface AdminHeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function AdminHeader({ onOpenMobileSidebar }: AdminHeaderProps) {
  const [user, setUser] = useState<UserProfile>(mockAdminUser);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", authUser.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              name: profile.full_name,
              email: profile.email || authUser.email || "",
              role: (profile.role as "resident" | "admin") || "admin",
              barangay: profile.barangay || "Barangay Butuan City",
              phone: profile.phone || "",
              address: profile.address || "",
              avatar: profile.avatar_url || mockAdminUser.avatar,
            });

            // Get unread notifications or reports count
            const { count } = await supabase
              .from("notifications")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id)
              .eq("is_read", false);

            if (count !== null && count !== undefined) {
              setUnreadCount(count);
            }
          }
        }
      } catch {
        // Fallback to default user state
      }
    }

    loadAdminData();
  }, []);

  return (
    <TopNavbar
      user={user}
      onOpenMobileSidebar={onOpenMobileSidebar}
      unreadNotificationsCount={unreadCount}
    />
  );
}
