"use client";

import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import firebaseApp from "./firebase";

let messaging: Messaging | null = null;

// Initialize messaging only on client side
if (typeof window !== "undefined") {
  messaging = getMessaging(firebaseApp);
}

export const requestNotificationPermission = async () => {
  try {
    console.log("STEP 1");

    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return null;
    }

    const permission = await Notification.requestPermission();
    console.log("PERMISSION:", permission);

    console.log("STEP 2 messaging:", messaging);

    if (!messaging) {
      console.log("MESSAGING IS NULL");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    console.log("STEP 3 TOKEN:", token);

    return token;
  } catch (e) {
    console.error("FCM ERROR:", e);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Message received in foreground:", payload);
        resolve(payload);
      });
    }
  });

export { messaging };
