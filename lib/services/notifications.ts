import { createClient } from "@/lib/supabase/server";
import { NotificationRow } from "@/types/database";

export async function getNotifications(
  userProfileId: string
): Promise<NotificationRow[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userProfileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error.message);
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export async function getUnreadNotificationCount(
  userProfileId: string
): Promise<number> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userProfileId)
      .eq("is_read", false);

    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) return { success: false };
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function markAllNotificationsAsRead(
  userProfileId: string
): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userProfileId)
      .eq("is_read", false);

    if (error) return { success: false };
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function createNotification(
  userProfileId: string,
  title: string,
  message: string,
  type: string = "status_update",
  reportId?: string
): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("notifications").insert({
      user_id: userProfileId,
      title,
      message,
      type,
      report_id: reportId ?? null,
      is_read: false,
    });

    if (error) return { success: false };
    return { success: true };
  } catch {
    return { success: false };
  }
}
