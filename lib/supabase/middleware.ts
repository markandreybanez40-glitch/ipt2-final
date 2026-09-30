import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  // If Supabase credentials are placeholder values during setup, let static routes pass through gracefully
  if (!supabaseUrl || supabaseUrl.includes("your-project")) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Protected routes check
  if (path.startsWith("/resident") || path.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(url);
    }

    // Role-based route guard
    if (path.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/resident/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  // If user is logged in and navigates to login, redirect to respective dashboard
  if (path === "/login" && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const url = request.nextUrl.clone();
    if (profile?.role === "admin") {
      url.pathname = "/admin/dashboard";
    } else {
      url.pathname = "/resident/dashboard";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
