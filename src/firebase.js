import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQoR-nNMfons4FK69Hc00-4RM0wFhJR_E",
  authDomain: "cursor-chat-e4b8b.firebaseapp.com",
  projectId: "cursor-chat-e4b8b",
  storageBucket: "cursor-chat-e4b8b.firebasestorage.app",
  messagingSenderId: "935104743439",
  appId: "1:935104743439:web:e31f4d529ef6f8af9bfb7a",
  measurementId: "G-R71EHSX209",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Store current user's UID to prevent notifications from self
let currentUserUID = null;

// Function to get token and register with CometChat
export const requestNotificationPermission = async (
  CometChatNotifications,
  providerId
) => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");

      // Get the token
      const vapidKey =
        "BLtG07oKM7h-Wjb6oIRD28clbbawtrELOOrQtHzMCUR4MXKTTKRQilchz2v5JdKA7eFip6Wq78rPBe-ecPKoOO4"; // Get this from Firebase Console > Cloud Messaging > Web Push certificates
      const fcmToken = await getToken(messaging, { vapidKey });

      if (fcmToken) {
        console.log("FCM Token:", fcmToken);

        // Register token with CometChat
        try {
          const response = await CometChatNotifications.registerPushToken(
            fcmToken,
            CometChatNotifications.PushPlatforms.FCM_WEB,
            providerId
          );
          console.log("Token registration successful:", response);
          return true;
        } catch (error) {
          console.error("Error registering token with CometChat:", error);
          return false;
        }
      } else {
        console.log("No registration token available.");
        return false;
      }
    } else {
      console.log("Notification permission denied.");
      return false;
    }
  } catch (error) {
    console.error("Error getting permission:", error);
    return false;
  }
};

// Function to update current user's UID
export const updateCurrentUser = (uid) => {
  currentUserUID = uid;
  console.log("Current user UID updated:", currentUserUID);
};

// Function to unregister token before logout
export const unregisterPushToken = async (CometChatNotifications) => {
  try {
    await CometChatNotifications.unregisterPushToken();
    console.log("Token unregistered successfully");
    return true;
  } catch (error) {
    console.error("Error unregistering token:", error);
    return false;
  }
};
