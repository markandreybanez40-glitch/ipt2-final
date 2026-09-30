"use server";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/services/notifications";
import { revalidatePath } from "next/cache";

export async function markNotificationReadAction(notificationId: string) {
  const result = await markNotificationAsRead(notificationId);
  revalidatePath("/resident/notifications");
  revalidatePath("/admin/notifications");
  return result;
}

export async function markAllNotificationsReadAction() {
  const profile = await getCurrentProfile();
  if (!profile) return { success: false };

  const result = await markAllNotificationsAsRead(profile.id);
  revalidatePath("/resident/notifications");
  revalidatePath("/admin/notifications");
  return result;
}
