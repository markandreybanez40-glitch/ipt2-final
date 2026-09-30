export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "resident" | "admin";
export type DBReportStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "resolved"
  | "rejected";
export type AnnouncementStatus = "draft" | "published" | "archived";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          barangay: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          barangay?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          barangay?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          report_number: string;
          resident_id: string;
          category: string;
          subject: string;
          description: string;
          location: string;
          date_time: string;
          status: DBReportStatus;
          photo_url: string | null;
          admin_remarks: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          report_number?: string;
          resident_id: string;
          category: string;
          subject: string;
          description: string;
          location: string;
          date_time?: string;
          status?: DBReportStatus;
          photo_url?: string | null;
          admin_remarks?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          report_number?: string;
          resident_id?: string;
          category?: string;
          subject?: string;
          description?: string;
          location?: string;
          date_time?: string;
          status?: DBReportStatus;
          photo_url?: string | null;
          admin_remarks?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_resident_id_fkey";
            columns: ["resident_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_assigned_to_fkey";
            columns: ["assigned_to"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      report_history: {
        Row: {
          id: string;
          report_id: string;
          status: string;
          remarks: string | null;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          status: string;
          remarks?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          status?: string;
          remarks?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "report_history_report_id_fkey";
            columns: ["report_id"];
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_history_changed_by_fkey";
            columns: ["changed_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string | null;
          is_read: boolean;
          report_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string | null;
          is_read?: boolean;
          report_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string | null;
          is_read?: boolean;
          report_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_report_id_fkey";
            columns: ["report_id"];
            referencedRelation: "reports";
            referencedColumns: ["id"];
          }
        ];
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          status: AnnouncementStatus;
          created_by: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          status?: AnnouncementStatus;
          created_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          status?: AnnouncementStatus;
          created_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      report_attachments: {
        Row: {
          id: string;
          report_id: string;
          file_name: string | null;
          file_path: string | null;
          file_url: string | null;
          file_type: string | null;
          file_size: number | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          file_name?: string | null;
          file_path?: string | null;
          file_url?: string | null;
          file_type?: string | null;
          file_size?: number | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          file_name?: string | null;
          file_path?: string | null;
          file_url?: string | null;
          file_type?: string | null;
          file_size?: number | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "report_attachments_report_id_fkey";
            columns: ["report_id"];
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_attachments_uploaded_by_fkey";
            columns: ["uploaded_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
  };
}

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ReportRow = Database["public"]["Tables"]["reports"]["Row"];
export type ReportHistoryRow = Database["public"]["Tables"]["report_history"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];
export type ReportAttachmentRow = Database["public"]["Tables"]["report_attachments"]["Row"];
