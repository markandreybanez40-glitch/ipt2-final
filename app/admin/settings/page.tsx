"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconCheckCircle } from "@/components/ui/icons";
import { BARANGAY_NAME } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [barangayName, setBarangayName] = useState(BARANGAY_NAME);
  const [officerInCharge, setOfficerInCharge] = useState("Hon. Maria Santos (Barangay Captain)");
  const [hotline, setHotline] = useState("(085) 815-1234");
  const [emergencyPhone, setEmergencyPhone] = useState("+63 918 987 6543");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Barangay Administration Settings"
        description="Configure municipal desk details, emergency hotlines, and system parameters"
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin/dashboard" },
          { label: "Settings" },
        ]}
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
          <IconCheckCircle className="h-4 w-4" />
          <span>Barangay settings saved and updated successfully!</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Barangay Information & Hotlines</CardTitle>
          <CardDescription>
            These details are displayed on the public resident portal and emergency footers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Official Barangay Unit Name"
              value={barangayName}
              onChange={(e) => setBarangayName(e.target.value)}
              required
            />

            <Input
              label="Officer in Charge / Barangay Captain"
              value={officerInCharge}
              onChange={(e) => setOfficerInCharge(e.target.value)}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Barangay Hall Telephone Hotline"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                required
              />

              <Input
                label="24/7 CDRRMO / Emergency Mobile"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="submit">Save Settings</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
