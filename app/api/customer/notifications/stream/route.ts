import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/get-current-user";
import { notificationEmitter } from "@/libs/notification-emitter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId || userId !== currentUser.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send heartbeat every 30 seconds to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "heartbeat" })}\n\n`
            )
          );
        } catch (error) {
          clearInterval(heartbeatInterval);
        }
      }, 30000);

      // Subscribe to notifications for this specific user
      const unsubscribe = notificationEmitter.subscribe((notification) => {
        // Only send notifications meant for this user
        if (notification.userId === userId) {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(notification)}\n\n`)
            );
          } catch (error) {
            console.error("Error sending notification:", error);
          }
        }
      });

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeatInterval);
        unsubscribe();
        try {
          controller.close();
        } catch (error) {
          // Controller already closed
        }
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
