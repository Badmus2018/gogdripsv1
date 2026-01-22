import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ role: null, accessiblePages: [] }, { status: 401 });
    }
    // Return accessiblePages for managers, or empty for others
    return NextResponse.json({
      role: currentUser.role,
      accessiblePages: Array.isArray(currentUser.accessiblePages) ? currentUser.accessiblePages : [],
    });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ role: null, accessiblePages: [] }, { status: 500 });
  }
}
