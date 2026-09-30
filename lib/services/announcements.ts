import { createClient } from "@/lib/supabase/server";
import { AnnouncementInput } from "@/lib/validations/announcement";
import { AnnouncementRow, AnnouncementStatus } from "@/types/database";

export interface AnnouncementWithCreator extends AnnouncementRow {
  creator?: {
    full_name: string;
    role: string;
  } | null;
}

export async function getAnnouncements(options?: {
  status?: string;
}): Promise<AnnouncementWithCreator[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("announcements")
      .select(`
        *,
        creator:profiles!announcements_created_by_fkey(
          full_name,
          role
        )
      `)
      .order("created_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status as AnnouncementStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching announcements:", error.message);
      return [];
    }

    return (data || []) as unknown as AnnouncementWithCreator[];
  } catch {
    return [];
  }
}

export async function getPublishedAnnouncements(
  limit: number = 5
): Promise<AnnouncementWithCreator[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("announcements")
      .select(`
        *,
        creator:profiles!announcements_created_by_fkey(
          full_name,
          role
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return (data || []) as unknown as AnnouncementWithCreator[];
  } catch {
    return [];
  }
}

export async function createAnnouncement(
  input: AnnouncementInput,
  creatorProfileId: string
): Promise<{ success: boolean; data?: AnnouncementRow; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: input.title,
        content: input.content,
        status: input.status,
        created_by: creatorProfileId,
        published_at: input.status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating announcement:", error.message);
      return { success: false, error: "Failed to broadcast announcement." };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error in createAnnouncement:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateAnnouncementStatus(
  id: string,
  status: AnnouncementStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("announcements")
      .update({
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) return { success: false, error: "Failed to update status." };
    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred." };
  }
}
