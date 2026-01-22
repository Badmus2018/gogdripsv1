import { NextResponse } from "next/server";
import prisma from "@/libs/mongodb";
import { sendMulticastNotification } from "@/libs/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, body: message, url } = body;
    if (!title || !message) {
      return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
    }
    // Find all admin users with fcmToken using Prisma/Postgres
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
        fcmToken: {
          not: null,
        },
      },
      select: {
        fcmToken: true,
      },
    });
    const tokens = admins
      .map((admin) => admin.fcmToken)
      .filter((token): token is string => typeof token === "string");
    if (!tokens.length) {
      return NextResponse.json({ error: "No admin FCM tokens found" }, { status: 404 });
    }
    const response = await sendMulticastNotification(
      tokens,
      title,
      message,
      { url: url || "/admin/manage-orders" }
    );
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Admin notification error:", error);
    return NextResponse.json({ error: "Failed to send admin notification" }, { status: 500 });
  }
}
