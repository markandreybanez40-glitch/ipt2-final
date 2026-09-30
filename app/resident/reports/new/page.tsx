"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ReportForm } from "@/components/reports/report-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { mockCurrentUser } from "@/lib/mock-data";

export default function NewReportPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Submit New Incident Report"
        description="Fill out the incident details below for official barangay investigation and dispatch"
        breadcrumbs={[
          { label: "Dashboard", href: "/resident/dashboard" },
          { label: "My Reports", href: "/resident/reports" },
          { label: "New Report" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Incident Details & Evidence</CardTitle>
          <CardDescription>
            Provide comprehensive details to help the barangay team respond efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportForm
            residentId={mockCurrentUser.id}
            residentName={mockCurrentUser.name}
            onSuccessRedirect="/resident/reports"
          />
        </CardContent>
      </Card>
    </div>
  );
}
