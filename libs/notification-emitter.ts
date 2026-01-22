// Global notification broadcaster for SSE
// This allows us to emit notifications from API routes

type NotificationCallback = (notification: any) => void;

class NotificationEmitter {
  private listeners: Set<NotificationCallback> = new Set();

  subscribe(callback: NotificationCallback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(notification: any) {
    this.listeners.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error("Error emitting notification:", error);
      }
    });
  }
}

// Create a global singleton
const globalForNotifications = global as typeof global & {
  notificationEmitter?: NotificationEmitter;
};

export const notificationEmitter =
  globalForNotifications.notificationEmitter ?? new NotificationEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForNotifications.notificationEmitter = notificationEmitter;
}
