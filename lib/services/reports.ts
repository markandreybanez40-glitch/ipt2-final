import { createClient } from "@/lib/supabase/server";
import { CreateReportInput } from "@/lib/validations/report";
import { DBReportStatus, ReportRow, ReportHistoryRow } from "@/types/database";

export interface ReportWithDetails extends ReportRow {
  resident?: {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
  } | null;
  history?: ReportHistoryRow[];
}

export async function getReports(options?: {
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
}): Promise<ReportWithDetails[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("reports")
      .select(`
        *,
        resident:profiles!reports_resident_id_fkey(
          id,
          full_name,
          email,
          phone,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status as DBReportStatus);
    }

    if (options?.category && options.category !== "all") {
      query = query.eq("category", options.category);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching reports:", error.message);
      return [];
    }

    let results = (data || []) as unknown as ReportWithDetails[];

    if (options?.search && options.search.trim()) {
      const term = options.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.report_number.toLowerCase().includes(term) ||
          r.subject.toLowerCase().includes(term) ||
          r.location.toLowerCase().includes(term) ||
          (r.resident?.full_name && r.resident.full_name.toLowerCase().includes(term))
      );
    }

    return results;
  } catch (err) {
    console.error("Unexpected error fetching reports:", err);
    return [];
  }
}

export async function getResidentReports(
  residentId: string,
  options?: { status?: string; search?: string }
): Promise<ReportWithDetails[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("reports")
      .select(`
        *,
        resident:profiles!reports_resident_id_fkey(
          id,
          full_name,
          email,
          phone,
          avatar_url
        )
      `)
      .eq("resident_id", residentId)
      .order("created_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status as DBReportStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching resident reports:", error.message);
      return [];
    }

    let results = (data || []) as unknown as ReportWithDetails[];

    if (options?.search && options.search.trim()) {
      const term = options.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.report_number.toLowerCase().includes(term) ||
          r.subject.toLowerCase().includes(term) ||
          r.location.toLowerCase().includes(term)
      );
    }

    return results;
  } catch (err) {
    console.error("Unexpected error fetching resident reports:", err);
    return [];
  }
}

export async function getReportById(id: string): Promise<ReportWithDetails | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reports")
      .select(`
        *,
        resident:profiles!reports_resident_id_fkey(
          id,
          full_name,
          email,
          phone,
          avatar_url
        )
      `)
      .or(`id.eq.${id},report_number.eq.${id}`)
      .single();

    if (error || !data) {
      return null;
    }

    // Fetch timeline history for this report
    const { data: history } = await supabase
      .from("report_history")
      .select("*")
      .eq("report_id", data.id)
      .order("created_at", { ascending: true });

    return {
      ...(data as unknown as ReportWithDetails),
      history: history || [],
    };
  } catch (err) {
    console.error("Error retrieving report by id:", err);
    return null;
  }
}

export async function createReport(
  input: CreateReportInput,
  residentProfileId: string
): Promise<{ success: boolean; data?: ReportRow; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reports")
      .insert({
        resident_id: residentProfileId,
        category: input.category,
        subject: input.subject,
        description: input.description,
        location: input.location,
        date_time: input.dateTime || new Date().toISOString(),
        photo_url: input.photoUrl || null,
        status: "submitted",
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting report:", error.message);
      return { success: false, error: "Unable to create report. Please try again." };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error creating report:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateReportStatus(
  reportId: string,
  status: DBReportStatus,
  adminRemarks?: string,
  assignedTo?: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("reports")
      .update({
        status,
        admin_remarks: adminRemarks ?? null,
        assigned_to: assignedTo ?? null,
      })
      .eq("id", reportId);

    if (error) {
      console.error("Error updating report status:", error.message);
      return { success: false, error: "Failed to update report status." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error updating status:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getReportHistory(reportId: string): Promise<ReportHistoryRow[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("report_history")
      .select("*")
      .eq("report_id", reportId)
      .order("created_at", { ascending: true });

    if (error) {
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}
