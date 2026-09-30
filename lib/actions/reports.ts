"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { createReportSchema, updateReportStatusSchema, CreateReportInput, UpdateReportStatusInput } from "@/lib/validations/report";
import { createReport, updateReportStatus } from "@/lib/services/reports";
import { revalidatePath } from "next/cache";

export async function submitReportAction(
  formData: CreateReportInput
): Promise<{ success: boolean; reportId?: string; error?: string }> {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { success: false, error: "You must be signed in to submit a report." };
    }

    const validated = createReportSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const result = await createReport(validated.data, profile.id);

    if (!result.success || !result.data) {
      return { success: false, error: result.error || "Failed to submit report." };
    }

    revalidatePath("/resident/dashboard");
    revalidatePath("/resident/reports");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/reports");

    return { success: true, reportId: result.data.id };
  } catch (err) {
    console.error("Error in submitReportAction:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateReportStatusAction(
  reportId: string,
  data: UpdateReportStatusInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const validated = updateReportStatusSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const result = await updateReportStatus(
      reportId,
      validated.data.status,
      validated.data.adminRemarks,
      profile.id
    );

    if (!result.success) {
      return { success: false, error: result.error || "Failed to update report." };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/reports");
    revalidatePath(`/admin/reports/${reportId}`);
    revalidatePath("/resident/dashboard");
    revalidatePath("/resident/reports");
    revalidatePath(`/resident/reports/${reportId}`);

    return { success: true };
  } catch (err) {
    console.error("Error in updateReportStatusAction:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
