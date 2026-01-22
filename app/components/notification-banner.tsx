"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const NotificationBanner = () => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch("/api/notification-banner")
      .then(res => res.json())
      .then(data => setMessage(data.message || ""));
  }, []);

  if (!message || !visible) return null;

  return (
    <div className="w-full bg-yellow-200 text-center py-2 fixed top-0 left-0 z-50 flex items-center justify-center">
      <span className="flex-1">{message}</span>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
      >
        <X />
      </button>
    </div>
  );
};

export default NotificationBanner;
