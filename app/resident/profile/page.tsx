"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ResidentProfileView } from "@/components/resident/resident-profile";
import { mockCurrentUser } from "@/lib/mock-data";

export default function ResidentProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resident Profile"
        description="Manage your account profile and verify residency information"
        breadcrumbs={[
          { label: "Dashboard", href: "/resident/dashboard" },
          { label: "Profile" },
        ]}
      />

      <ResidentProfileView initialProfile={mockCurrentUser} />
    </div>
  );
}
