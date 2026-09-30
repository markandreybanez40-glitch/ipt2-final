"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { IconPlus, IconCalendar, IconUser } from "@/components/ui/icons";
import { mockAnnouncements } from "@/lib/mock-data";
import { Announcement, AnnouncementPriority } from "@/types/announcement";
import {
  createAnnouncementAction,
  toggleAnnouncementStatusAction,
} from "@/lib/actions/announcements";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New announcement form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Community Event");
  const [priority, setPriority] = useState<AnnouncementPriority>("medium");

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    try {
      await createAnnouncementAction({
        title,
        content,
        status: "published",
      });

      const now = new Date();
      const datePosted = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now);

      const newAnnouncement: Announcement = {
        id: `ANN-${String(Date.now()).slice(-4)}`,
        title,
        content,
        category,
        priority,
        targetAudience: "all",
        author: "Hon. Maria Santos",
        authorRole: "Barangay Captain",
        datePosted,
        isActive: true,
      };

      setAnnouncements([newAnnouncement, ...announcements]);
      setTitle("");
      setContent("");
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
    await toggleAnnouncementStatusAction(
      id,
      currentActive ? "archived" : "published"
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Barangay Announcements & Bulletins"
        description="Publish public notices, event invitations, and urgent municipal advisories"
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin/dashboard" },
          { label: "Announcements" },
        ]}
        action={
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2 cursor-pointer">
            <IconPlus className="h-4 w-4" />
            New Announcement
          </Button>
        }
      />

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        item.priority === "urgent"
                          ? "destructive"
                          : item.priority === "high"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {item.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {item.isActive ? "Active Broadcast" : "Archived"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                    {item.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <IconUser className="h-3.5 w-3.5" />
                      <span>
                        Posted by: {item.author} ({item.authorRole})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IconCalendar className="h-3.5 w-3.5" />
                      <span>{item.datePosted}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(item.id, item.isActive)}
                    className="cursor-pointer"
                  >
                    {item.isActive ? "Archive" : "Set Active"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Announcement Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Create New Barangay Bulletin"
        description="Broadcast information to all registered residents"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <Input
            label="Announcement Title"
            placeholder="e.g. Schedule of Free Medical Mission"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "Community Event", label: "Community Event" },
                { value: "Public Advisory", label: "Public Advisory" },
                { value: "Health & Services", label: "Health & Services" },
                { value: "Governance", label: "Governance" },
              ]}
            />

            <Select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
              options={[
                { value: "low", label: "Low Priority" },
                { value: "medium", label: "Medium Priority" },
                { value: "high", label: "High Priority" },
                { value: "urgent", label: "Urgent (Alert Banner)" },
              ]}
            />
          </div>

          <Textarea
            label="Content / Notice Description"
            placeholder="Detailed text regarding the announcement..."
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Broadcasting..." : "Broadcast Bulletin"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
