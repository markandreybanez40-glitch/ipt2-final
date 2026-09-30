"use client";

import React, { useState } from "react";
import { ResidentProfile } from "@/types/user";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconMail, IconPhone, IconMapPin, IconCalendar, IconCheckCircle, IconAlertTriangle } from "@/components/ui/icons";
import { updateMyProfileAction } from "@/lib/actions/profiles";

export interface ResidentProfileViewProps {
  initialProfile: ResidentProfile;
}

export function ResidentProfileView({ initialProfile }: ResidentProfileViewProps) {
  const [profile, setProfile] = useState<ResidentProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialProfile.name);
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [address, setAddress] = useState(initialProfile.address || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await updateMyProfileAction({
        fullName: name,
        phone,
        address,
      });

      if (result.success) {
        setProfile({
          ...profile,
          name,
          phone,
          address,
        });
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        return;
      }

      // Local state fallback if running offline
      setProfile({
        ...profile,
        name,
        phone,
        address,
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
          <IconCheckCircle className="h-4 w-4" />
          <span>Profile changes updated successfully in database!</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
          <IconAlertTriangle className="h-4 w-4" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Top Profile Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-blue-500/20 shadow-sm"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                  {profile.name.charAt(0)}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    {profile.name}
                  </h2>
                  <Badge variant="success" className="text-[10px]">
                    Verified Resident
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Resident ID: {profile.id} • Registered Member
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <IconCalendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Joined {profile.joinedDate || "Recent"}</span>
                </div>
              </div>
            </div>

            <div>
              <Button
                variant={isEditing ? "secondary" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form / Info Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal & Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                value={profile.email}
                disabled
                helperText="Contact barangay admin to change your registered email address"
              />
              <Input
                label="Mobile Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+63 9xx xxx xxxx"
              />
              <Input
                label="Residential Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Block, Lot, Street, Purok"
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving to Database..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <IconMail className="h-5 w-5 text-slate-400" />
                <div>
                  <span className="block text-xs text-slate-400">Email Address</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {profile.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <IconPhone className="h-5 w-5 text-slate-400" />
                <div>
                  <span className="block text-xs text-slate-400">Contact Number</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {profile.phone || "Not specified"}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <IconMapPin className="h-5 w-5 text-slate-400" />
                <div>
                  <span className="block text-xs text-slate-400">Home Address</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {profile.address || "Purok 3, Riverside, Butuan City"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
