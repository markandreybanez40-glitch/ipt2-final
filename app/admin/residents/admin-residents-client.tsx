"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IconPhone, IconMail, IconMapPin } from "@/components/ui/icons";
import { ResidentProfile } from "@/types/user";

export function AdminResidentsClient({
  initialResidents,
}: {
  initialResidents: ResidentProfile[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [residents] = useState<ResidentProfile[]>(initialResidents);

  const filteredResidents = residents.filter(
    (res) =>
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (res.address && res.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Input
            placeholder="Search residents by name, ID, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-500">
          Showing {filteredResidents.length} of {residents.length} residents
        </div>
      </div>

      {/* Residents Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {filteredResidents.map((resident) => (
          <Card key={resident.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                {resident.avatarUrl ? (
                  <img
                    src={resident.avatarUrl}
                    alt={resident.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {resident.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                      {resident.name}
                    </h3>
                    <Badge variant="success" className="text-[10px] shrink-0">
                      Verified
                    </Badge>
                  </div>

                  <p className="font-mono text-xs text-blue-600 dark:text-blue-400">
                    {resident.id}
                  </p>

                  <div className="space-y-1 pt-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2 truncate">
                      <IconMail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{resident.email}</span>
                    </div>

                    {resident.phone && (
                      <div className="flex items-center gap-2">
                        <IconPhone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span>{resident.phone}</span>
                      </div>
                    )}

                    {resident.address && (
                      <div className="flex items-center gap-2 truncate">
                        <IconMapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{resident.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Report summary pills */}
                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {resident.totalReports} reports filed
                    </span>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {resident.resolvedReports} resolved
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
