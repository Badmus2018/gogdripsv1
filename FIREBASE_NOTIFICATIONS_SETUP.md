# Firebase Push Notifications Setup Guide

## 🔥 Firebase Push Notifications for Mobile Lockscreen

This guide will help you set up Firebase Cloud Messaging (FCM) for lockscreen notifications on mobile devices.

## 📋 Prerequisites

1. Firebase project (create one at https://console.firebase.google.com)
2. All required packages are already installed

## 🔧 Setup Steps

### 1. Firebase Console Configuration

1. Go to your Firebase Console: https://console.firebase.google.com
2. Select your project (or create a new one)
3. Navigate to **Project Settings** (gear icon)
4. Under **General** tab, scroll to **Your apps**
5. Add a web app if you haven't already
6. Copy your Firebase config values

### 2. Generate VAPID Key

1. In Firebase Console, go to **Project Settings** → **Cloud Messaging**
2. Scroll to **Web configuration**
3. Click **Generate key pair** under **Web Push certificates**
4. Copy the VAPID key

### 3. Get Firebase Admin SDK Credentials

1. In Firebase Console, go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Extract the following values from the JSON:
   - `project_id`
   - `private_key_id`
   - `private_key`
   - `client_email`
   - `client_id`

### 4. Update Environment Variables

Add these to your `.env.local` file:

```env
# Firebase Client Config (from Firebase Console - General Settings)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Firebase VAPID Key (from Cloud Messaging settings)
NEXT_PUBLIC_FIREBASE_VAPID_KEY="your-vapid-key"

# Firebase Admin SDK (from Service Account JSON)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY_ID="your-private-key-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="your-client-id"
```

### 5. Update Service Worker

Edit `/public/firebase-messaging-sw.js` and replace the placeholder values with your actual Firebase config:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

### 6. Update Prisma Database

Run the following commands to update your database schema:

```bash
npx prisma generate
npx prisma db push
```

This adds the `fcmToken` field to the User model.

### 7. Add Notification Icons

Create the following icon files in your `/public` directory:
- `icon-192x192.png` (192x192 pixels)
- `icon-96x96.png` (96x96 pixels)

These will be used for notification icons on mobile devices.

### 8. Register Service Worker

The service worker is automatically registered from the `/public` directory. Make sure `/public/firebase-messaging-sw.js` exists.

## 📱 How It Works

### For Users:
1. **Enable Notifications**: Users see a "Enable Notifications" button in the navbar (when logged in)
2. **Permission Request**: Clicking the button requests browser notification permission
3. **Token Registration**: Once granted, the FCM token is saved to their user profile
4. **Receive Notifications**: Users get lockscreen notifications when:
   - Their order is dispatched
   - Other important updates occur

### For Developers:
1. **Frontend**: `NotificationButton` component handles permission requests
2. **Backend**: When order status changes to "dispatched", the system:
   - Saves notification to database
   - Emits real-time SSE notification
   - Sends push notification to user's device via FCM
3. **Service Worker**: Handles background notifications when app is closed

## 🧪 Testing

### Test on Desktop:
1. Open your app in Chrome/Firefox
2. Log in as a user
3. Click "Enable Notifications" button
4. Allow permissions
5. Create a test order
6. As admin, mark the order as "dispatched"
7. You should receive a notification

### Test on Mobile:
1. Open your app in mobile browser (Chrome/Safari)
2. Add app to home screen (PWA)
3. Log in and enable notifications
4. Lock your phone
5. Create and dispatch a test order from another device
6. Check if notification appears on lockscreen

## 🚀 Features

- ✅ Lockscreen notifications on mobile
- ✅ Browser notifications on desktop
- ✅ Background notifications (app closed)
- ✅ Foreground notifications (app open)
- ✅ Notification badge in navbar
- ✅ Click notification to open order details
- ✅ Automatic retry on failure
- ✅ Multi-device support (each device gets its own token)

## 🎨 Customization

### Change Notification Sound:
Edit `/public/firebase-messaging-sw.js`:
```javascript
const notificationOptions = {
  // ...
  sound: '/notification-sound.mp3', // Add custom sound
  // ...
};
```

### Change Notification Icon:
Update icon paths in:
- `/libs/firebase-admin.ts`
- `/public/firebase-messaging-sw.js`

### Add More Notification Types:
1. Create notification trigger in your API route
2. Call `sendPushNotification()` with appropriate data
3. Handle notification type in service worker

## 🔐 Security Notes

- Never commit `.env.local` to git
- Keep your Firebase Admin SDK credentials secure
- Private keys should have `\n` properly escaped
- Use environment-specific Firebase projects (dev/staging/prod)

## 📝 Troubleshooting

**Notifications not appearing?**
- Check browser console for errors
- Verify Firebase config in `.env.local`
- Ensure service worker is registered (`chrome://serviceworker-internals`)
- Check notification permissions in browser settings
- Verify FCM token is saved in user document

**Service worker errors?**
- Clear browser cache and service workers
- Check service worker file path is `/firebase-messaging-sw.js`
- Verify Firebase config matches your project

**Token not saving?**
- Check network tab for API errors
- Verify user is logged in
- Check database for `fcmToken` field

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Need Help?** Check the Firebase documentation or console logs for detailed error messages.
