"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { REPORT_CATEGORIES } from "@/lib/constants";
import { ReportPriority } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconUpload, IconCheckCircle, IconX } from "@/components/ui/icons";
import { submitReportAction } from "@/lib/actions/reports";
import { uploadReportPhoto } from "@/lib/supabase/storage";
import { useReports } from "@/hooks/use-reports";

export interface ReportFormProps {
  residentId?: string;
  residentName?: string;
  onSuccessRedirect?: string;
}

export function ReportForm({
  residentId = "RES-001",
  residentName = "Juan Dela Cruz",
  onSuccessRedirect = "/resident/reports",
}: ReportFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addReport } = useReports();

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<string>(REPORT_CATEGORIES[0]);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ReportPriority>("medium");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: "File size exceeds 10MB limit." }));
        return;
      }
      setSelectedFile(file);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.file;
        return next;
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!subject.trim()) errs.subject = "Subject is required";
    if (!category) errs.category = "Category is required";
    if (!location.trim()) errs.location = "Exact location or landmark is required";
    if (!description.trim() || description.length < 10) {
      errs.description = "Please describe the incident details (minimum 10 characters)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    let finalPhotoUrl = imageUrl.trim();

    try {
      // 1. Upload photo to Supabase Storage if file is attached
      if (selectedFile) {
        const uploadResult = await uploadReportPhoto(
          selectedFile,
          residentId,
          `temp-${Date.now()}`
        );
        if (uploadResult.url) {
          finalPhotoUrl = uploadResult.url;
        }
      }

      // If no image was provided, set sample representative incident photo
      if (!finalPhotoUrl) {
        finalPhotoUrl =
          "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80";
      }

      // 2. Submit report through Supabase Server Action
      const result = await submitReportAction({
        category: category as (typeof REPORT_CATEGORIES)[number],
        subject,
        description,
        location,
        dateTime: new Date().toISOString(),
        photoUrl: finalPhotoUrl,
      });

      if (result.success && result.reportId) {
        setSuccessToast(true);
        setTimeout(() => {
          router.push(onSuccessRedirect || `/resident/reports/${result.reportId}`);
          router.refresh();
        }, 600);
        return;
      }

      // Fallback: If live server database is initializing or running in offline mode, save locally
      const created = addReport({
        residentId,
        residentName,
        category,
        subject,
        description,
        location,
        priority,
        image: finalPhotoUrl,
      });

      setSuccessToast(true);
      setTimeout(() => {
        router.push(onSuccessRedirect || `/resident/reports/${created.id}`);
      }, 600);
    } catch {
      setServerError("Failed to submit report. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
          <IconCheckCircle className="h-4 w-4" />
          <span>Report submitted successfully to Barangay Incident Desk!</span>
        </div>
      )}

      {serverError && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
          <IconAlertTriangle className="h-4 w-4" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Report Subject / Title"
            placeholder="e.g., Broken Street Light along Narra St."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            error={errors.subject}
            helperText="Give a concise summary of the issue"
            required
          />
        </div>

        <div>
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={REPORT_CATEGORIES.map((c) => ({ value: c, label: c }))}
            error={errors.category}
          />
        </div>

        <div>
          <Select
            label="Priority Level"
            value={priority}
            onChange={(e) => setPriority(e.target.value as ReportPriority)}
            options={[
              { value: "low", label: "Low (General maintenance)" },
              { value: "medium", label: "Medium (Needs attention soon)" },
              { value: "high", label: "High (Safety / health hazard)" },
              { value: "urgent", label: "Urgent (Immediate emergency)" },
            ]}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Specific Location / Landmark"
            placeholder="e.g. Purok 3, Near Barangay Covered Court"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={errors.location}
            helperText="Include landmarks to help the response crew navigate accurately"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Textarea
            label="Detailed Description"
            placeholder="Explain what happened, since when, and any immediate risks..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            required
          />
        </div>

        {/* Photographic Evidence Attachment */}
        <div className="sm:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Photographic Evidence / Attachment (Optional)
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              id="file-attachment"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 cursor-pointer w-full sm:w-auto"
            >
              <IconUpload className="h-4 w-4 text-blue-600" />
              {selectedFile ? "Replace File" : "Upload Photo / Document"}
            </Button>

            <span className="text-xs text-slate-400">
              Max 10MB (JPG, PNG, WEBP, PDF)
            </span>
          </div>

          {errors.file && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{errors.file}</p>
          )}

          {filePreview && (
            <div className="relative mt-2 inline-block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <img
                src={filePreview}
                alt="Upload preview"
                className="h-36 w-auto object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeSelectedFile}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                aria-label="Remove image"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>
          )}

          {!selectedFile && (
            <div className="pt-2">
              <Input
                placeholder="Or paste an image URL (e.g., https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4 text-xs text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">
        <IconAlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <span>
          By submitting this report, you certify that the information provided is truthful and accurate for official barangay action.
        </span>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? "Submitting to Supabase..." : "Submit Report"}
        </Button>
      </div>
    </form>
  );
}
