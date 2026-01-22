// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBwz1czOBdyFU7FlF3VCq1i6zkCzYTUTB0",
  authDomain: "gogodrips.firebaseapp.com",
  projectId: "gogodrips",
  storageBucket: "gogodrips.firebasestorage.app",
  messagingSenderId: "229286330629",
  appId: "1:229286330629:web:5a0c5fe83fb520882af76c"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Import app name from appConfig
importScripts('/config/appConfig.js');

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Use appConfig.appName as default title
  const notificationTitle = payload.notification.title || (self.appConfig && self.appConfig.appName);
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: payload.data?.tag || 'default',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (let client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
