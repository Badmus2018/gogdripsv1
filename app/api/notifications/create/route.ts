import { NextResponse } from "next/server";

import prismadb from "@/libs/prismadb";


export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { title, body: message, orderId, userId } = body;

    if (!title || !message || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const notification = await prismadb.notification.create({
      data: {
        userId,
        title,
        body: message,
        orderId: orderId || undefined,
        read: false,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
