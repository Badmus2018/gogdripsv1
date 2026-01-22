import { NextRequest } from "next/server";
import getCurrentUser from "@/actions/get-current-user";
import { notificationEmitter } from "@/libs/notification-emitter";

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser();

  // Only allow admin users
  if (!currentUser || currentUser.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: "connected", message: "SSE connection established" })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Subscribe to notification events
      const unsubscribe = notificationEmitter.subscribe((notification) => {
        const eventData = `data: ${JSON.stringify({ type: "notification", data: notification })}\n\n`;
        try {
          controller.enqueue(encoder.encode(eventData));
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      });

      // Keep-alive heartbeat every 30 seconds
      const heartbeat = setInterval(() => {
        try {
          const heartbeatData = `data: ${JSON.stringify({ type: "heartbeat" })}\n\n`;
          controller.enqueue(encoder.encode(heartbeatData));
        } catch (error) {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch (error) {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  });
}
