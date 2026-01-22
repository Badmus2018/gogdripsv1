import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";

// Helper to get absolute URL
function absoluteUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return new URL(path, base).toString();
}

// Usage: import { enforceManagerPageAccess } from "@/middleware/enforceManagerPageAccess";
// Call enforceManagerPageAccess("page-key") in your page/server component
export async function enforceManagerPageAccess(pageKey: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.redirect(absoluteUrl("/login"));
  }
  if (currentUser.role === "MANAGER") {
    const allowed = Array.isArray(currentUser.accessiblePages)
      ? currentUser.accessiblePages.includes(pageKey)
      : false;
    if (!allowed) {
      return NextResponse.redirect(absoluteUrl("/admin")); // or a custom access denied page
    }
  }
  return null; // access granted
}
