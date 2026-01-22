
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";
import prismadb from "@/libs/prismadb";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, role, accessiblePages } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build update data
    const updateData: any = {};
    if (role) {
      if (!["USER", "ADMIN", "MANAGER"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      updateData.role = role;
    }
    if (Array.isArray(accessiblePages)) {
      updateData.accessiblePages = accessiblePages;
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const user = await prismadb.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
