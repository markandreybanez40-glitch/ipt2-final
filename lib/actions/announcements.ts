"use server";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { announcementSchema, AnnouncementInput } from "@/lib/validations/announcement";
import { createAnnouncement, updateAnnouncementStatus } from "@/lib/services/announcements";
import { AnnouncementStatus } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function createAnnouncementAction(
  data: AnnouncementInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin privileges required." };
    }

    const validated = announcementSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const result = await createAnnouncement(validated.data, profile.id);

    if (!result.success) {
      return { success: false, error: result.error || "Failed to create announcement." };
    }

    revalidatePath("/admin/announcements");
    revalidatePath("/admin/dashboard");
    revalidatePath("/resident/dashboard");

    return { success: true };
  } catch (err) {
    console.error("Error in createAnnouncementAction:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function toggleAnnouncementStatusAction(
  id: string,
  newStatus: AnnouncementStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Unauthorized." };
    }

    const result = await updateAnnouncementStatus(id, newStatus);
    if (!result.success) {
      return { success: false, error: result.error || "Failed to update." };
    }

    revalidatePath("/admin/announcements");
    revalidatePath("/resident/dashboard");

    return { success: true };
  } catch {
    return { success: false, error: "Failed to update announcement." };
  }
}
