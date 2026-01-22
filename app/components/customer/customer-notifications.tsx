"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CustomerNotificationsProps {
  userId: string;
}

const CustomerNotifications: React.FC<CustomerNotificationsProps> = ({
  userId,
}) => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const router = useRouter();

  useEffect(() => {
    const connectSSE = () => {
      const eventSource = new EventSource(
        `/api/customer/notifications/stream?userId=${userId}`
      );
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "heartbeat") {
            return;
          }

          if (message.type === "notification") {
            // Show toast notification
            if (message.message.includes("confirmed")) {
              toast.success("Your payment has been confirmed by admin!", {
                duration: 5000,
              });
            } else if (message.message.includes("dispatched")) {
              toast.success("Your order has been dispatched!", {
                duration: 5000,
              });
            } else if (message.message.includes("delivered")) {
              toast.success("Your order has been delivered!", {
                duration: 5000,
              });
            } else {
              toast.success(message.message, {
                duration: 5000,
              });
            }

            // Refresh the page to show updated data
            router.refresh();
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        // Reconnect after 5 seconds
        setTimeout(() => {
          if (eventSourceRef.current === eventSource) {
            connectSSE();
          }
        }, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [userId, router]);

  return null; // This component doesn't render anything
};

export default CustomerNotifications;
