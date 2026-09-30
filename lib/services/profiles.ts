import { createClient } from "@/lib/supabase/server";
import { UpdateProfileInput } from "@/lib/validations/profile";
import { ProfileRow } from "@/types/database";

export interface ResidentWithReportCount extends ProfileRow {
  totalReports: number;
  resolvedReports: number;
}

export async function getProfile(profileId: string): Promise<ProfileRow | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function updateProfile(
  profileId: string,
  input: UpdateProfileInput
): Promise<{ success: boolean; data?: ProfileRow; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: input.fullName,
        phone: input.phone ?? null,
        address: input.address ?? null,
        barangay: input.barangay ?? null,
        avatar_url: input.avatarUrl ?? null,
      })
      .eq("id", profileId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error.message);
      return { success: false, error: "Failed to update profile." };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error updating profile:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getResidents(
  search?: string
): Promise<ResidentWithReportCount[]> {
  try {
    const supabase = await createClient();

    const { data: residents, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "resident")
      .order("created_at", { ascending: false });

    if (error || !residents) {
      return [];
    }

    // Fetch report counts for each resident
    const { data: allReports } = await supabase
      .from("reports")
      .select("id, resident_id, status");

    const reportsByResident = (allReports || []).reduce<
      Record<string, { total: number; resolved: number }>
    >((acc, r) => {
      if (!acc[r.resident_id]) {
        acc[r.resident_id] = { total: 0, resolved: 0 };
      }
      acc[r.resident_id].total += 1;
      if (r.status === "resolved") {
        acc[r.resident_id].resolved += 1;
      }
      return acc;
    }, {});

    let results: ResidentWithReportCount[] = residents.map((res) => ({
      ...res,
      totalReports: reportsByResident[res.id]?.total || 0,
      resolvedReports: reportsByResident[res.id]?.resolved || 0,
    }));

    if (search && search.trim()) {
      const term = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.full_name.toLowerCase().includes(term) ||
          (r.email && r.email.toLowerCase().includes(term)) ||
          (r.phone && r.phone.toLowerCase().includes(term)) ||
          (r.address && r.address.toLowerCase().includes(term))
      );
    }

    return results;
  } catch (err) {
    console.error("Error retrieving residents:", err);
    return [];
  }
}
