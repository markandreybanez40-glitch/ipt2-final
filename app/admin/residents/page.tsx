import React from "react";
import { getResidents } from "@/lib/services/profiles";
import { PageHeader } from "@/components/layout/page-header";
import { AdminResidentsClient } from "./admin-residents-client";
import { ResidentProfile } from "@/types/user";
import { mockResidents } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function AdminResidentsPage() {
  const dbResidents = await getResidents();

  let residents: ResidentProfile[];

  if (dbResidents.length > 0) {
    residents = dbResidents.map((r) => ({
      id: r.id,
      name: r.full_name,
      email: r.email || "",
      phone: r.phone || undefined,
      address: r.address || undefined,
      barangay: r.barangay || "Barangay Poblacion, Butuan City",
      avatarUrl: r.avatar_url || undefined,
      role: "resident",
      joinedDate: new Date(r.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      totalReports: r.totalReports,
      resolvedReports: r.resolvedReports,
      pendingReports: r.totalReports - r.resolvedReports,
    }));
  } else {
    residents = mockResidents;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Residents Directory"
        description="View and verify registered residents and their community engagement history"
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin/dashboard" },
          { label: "Residents" },
        ]}
      />

      <AdminResidentsClient initialResidents={residents} />
    </div>
  );
}
