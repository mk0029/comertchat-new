import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import {
  CometChatUIKit,
  CometChatUIKitLoginListener,
} from "@cometchat/chat-uikit-react";
import { COMETCHAT_CONSTANTS } from "../../AppConstants";
import { updateCurrentUser, requestNotificationPermission } from "../../firebase";

// Track current user
let currentUserUID: string | null = null;

interface CometChatClerkIntegrationProps {
  children: React.ReactNode;
}

const CometChatClerkIntegration: React.FC<CometChatClerkIntegrationProps> = ({
  children,
}) => {
  const { user, isSignedIn } = useUser();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isPageActive = useRef<boolean>(document.visibilityState === "visible");

  // Helper function to store user ID in localStorage
  const storeCurrentUserID = (uid: string) => {
    try {
      // Store in localStorage
      localStorage.setItem("currentUserUID", uid);
      console.log("Current user ID stored:", uid);
      return true;
    } catch (error) {
      console.error("Error storing user ID:", error);
      return false;
    }
  };

  // Set up message listeners for notifications
  const setupMessageListeners = () => {
    // Use a consistent listener ID to prevent duplicate registrations
    const listenerId = "notification_listener";
    
    // First remove any existing listeners with this ID to prevent duplicates
    CometChat.removeMessageListener(listenerId);
    
    // Then add the listener
    CometChat.addMessageListener(
      listenerId,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage: CometChat.TextMessage) => {
          console.log("Text message received for notification", textMessage.getId());
          showNotification(textMessage);
        },
        onMediaMessageReceived: (mediaMessage: CometChat.MediaMessage) => {
          console.log("Media message received for notification", mediaMessage.getId());
          showNotification(mediaMessage);
        },
        onCustomMessageReceived: (customMessage: CometChat.CustomMessage) => {
          console.log("Custom message received for notification", customMessage.getId());
          showNotification(customMessage);
        }
      })
    );

    // Return cleanup function
    return () => {
      console.log("Removing notification listener", listenerId);
      CometChat.removeMessageListener(listenerId);
    };
  };
  
  // Track message IDs to prevent duplicate notifications
  const processedMessageIds = useRef<Set<string>>(new Set());
  
  // Function to create and show push notifications
  const showNotification = (message: CometChat.BaseMessage) => {
    const messageId = String(message.getId());
    
    // Skip if we've already processed this message
    if (processedMessageIds.current.has(messageId)) {
      console.log("Skipping duplicate notification for message", messageId);
      return;
    }
    
    // Add to processed set
    processedMessageIds.current.add(messageId);
    
    // Don't show notifications for messages sent by the current user
    if (message.getSender().getUid() === currentUserUID) {
      return;
    }
    
    // Don't show notifications if the user is actively using the app
    if (isPageActive.current) {
      console.log("User is active on the page, skipping notification");
      return;
    }

    // Format notification title and message based on type
    let title = "";
    let body = "";
    
    if (message.getReceiverType() === CometChat.RECEIVER_TYPE.USER) {
      // One-on-one message format
      title = "New message";
      body = `${message.getSender().getName()}`;
    } else if (message.getReceiverType() === CometChat.RECEIVER_TYPE.GROUP) {
      // Group message format
      const group = message.getReceiver() as CometChat.Group;
      title = "New message";
      body = `${message.getSender().getName()} @ ${group.getName()}`;
    }

    // Add actual message text
    if (message instanceof CometChat.TextMessage) {
      body += `: ${message.getText()}`;
    } else if (message instanceof CometChat.MediaMessage) {
      body += ` sent a ${message.getType()} message`;
    } else if (message instanceof CometChat.CustomMessage) {
      body += ` sent a custom message`;
    }

    // Create and show the notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: message.getSender().getAvatar() || '/logo.png',
        silent: true, // Always disable sound since we're only showing notifications when tab is inactive
      });
    }
  };

  // Track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageActive.current = document.visibilityState === "visible";
      console.log("Page visibility changed:", isPageActive.current ? "visible" : "hidden");
    };

    // Initial state
    isPageActive.current = document.visibilityState === "visible";
    
    // Add event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Clean up
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isSignedIn && user) {
      // Initialize CometChat with the authenticated user
      const initCometChat = async () => {
        try {
          setIsInitializing(true);
          console.log("Initializing CometChat with Clerk user:", user.id);

          // Expose CometChat credentials to window for testing script
          try {
            // Use proper typecasting to avoid TypeScript errors
            (window as any).REACT_APP_COMETCHAT_APP_ID =
              COMETCHAT_CONSTANTS.APP_ID;
            (window as any).REACT_APP_COMETCHAT_REGION =
              COMETCHAT_CONSTANTS.REGION;
            (window as any).REACT_APP_COMETCHAT_AUTH_KEY =
              COMETCHAT_CONSTANTS.AUTH_KEY;

            // Also store in localStorage as backup
            localStorage.setItem("appId", COMETCHAT_CONSTANTS.APP_ID);
            localStorage.setItem("region", COMETCHAT_CONSTANTS.REGION);
            localStorage.setItem("authKey", COMETCHAT_CONSTANTS.AUTH_KEY);
          } catch (e) {
            console.error("Failed to expose CometChat credentials:", e);
          }

          // Check if the user is already logged in to CometChat
          const currentUser = CometChatUIKitLoginListener.getLoggedInUser();

          if (!currentUser) {
            // Use Clerk user ID as the CometChat UID
            const uid = user.id;
            const name =
              user.fullName ||
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.primaryEmailAddress?.emailAddress ||
              uid;
            const avatar = user.imageUrl;

            console.log(
              `Setting up CometChat user with UID: ${uid}, Name: ${name}`
            );

            // First check if user exists in CometChat
            try {
              const existingUser = await CometChat.getUser(uid);
              if (existingUser) {
                console.log("User already exists in CometChat:", existingUser);

                // Update user info if needed
                if (
                  existingUser.getName() !== name ||
                  existingUser.getAvatar() !== avatar
                ) {
                  console.log("Updating user info in CometChat");
                  const updatedUser = new CometChat.User(uid);
                  updatedUser.setName(name);
                  if (avatar) {
                    updatedUser.setAvatar(avatar);
                  }

                  const authKey =
                    COMETCHAT_CONSTANTS.AUTH_KEY ||
                    localStorage.getItem("authKey");
                  if (!authKey) {
                    throw new Error("CometChat Auth Key not found");
                  }

                  try {
                    await CometChat.updateUser(updatedUser, authKey);
                    console.log("User updated successfully in CometChat");
                  } catch (updateError) {
                    console.error(
                      "Error updating user in CometChat:",
                      updateError
                    );
                  }
                }
              }
            } catch (error) {
              console.log("User doesn't exist in CometChat, creating now...");
              // User doesn't exist, create a new user
              const authKey =
                COMETCHAT_CONSTANTS.AUTH_KEY || localStorage.getItem("authKey");
              if (!authKey) {
                throw new Error("CometChat Auth Key not found");
              }

              // Create a new user
              const newUser = new CometChat.User(uid);
              newUser.setName(name);
              if (avatar) {
                newUser.setAvatar(avatar);
              }

              try {
                await CometChat.createUser(newUser, authKey);
                console.log("User created successfully in CometChat:", newUser);
              } catch (createError) {
                console.error("Error creating user in CometChat:", createError);
                // Check if the error is because the user already exists
                // If so, continue as it's not a critical error
                if (
                  !(createError as any)?.message?.includes("already exists")
                ) {
                  throw createError;
                }
              }
            }

            // Login to CometChat with the user ID
            try {
              await CometChatUIKit.login(uid);
              console.log("User logged in successfully to CometChat:", uid);
              
              // Save current user UID
              currentUserUID = uid;
              // Update the current user in Firebase for notification filtering
              updateCurrentUser(uid);
              // Store user ID in localStorage
              storeCurrentUserID(uid);
              
              // Request notification permission
              if ("Notification" in window) {
                // Request permission for notifications
                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    console.log("Notification permission granted");
                    // Setup Firebase messaging if available
                    try {
                      if ((CometChat as any).Notifications) {
                        requestNotificationPermission((CometChat as any).Notifications, 'firebase');
                      }
                    } catch (error) {
                      console.error("Error setting up push notifications:", error);
                    }
                  }
                });
              }
              
              // Setup message listeners for notifications ONLY ONCE
              const cleanupListeners = setupMessageListeners();
            } catch (loginError) {
              console.error("Failed to login to CometChat:", loginError);
              throw loginError;
            }
          } else {
            console.log("User already logged in to CometChat:", currentUser);
            // Store current user UID
            currentUserUID = currentUser.getUid();
            // Update current user in Firebase
            updateCurrentUser(currentUser.getUid());
            storeCurrentUserID(currentUser.getUid());
            
            // Request notification permission
            if ("Notification" in window) {
              if (Notification.permission === "granted") {
                // Setup Firebase messaging if available
                try {
                  if ((CometChat as any).Notifications) {
                    requestNotificationPermission((CometChat as any).Notifications, 'firebase');
                  }
                } catch (error) {
                  console.error("Error setting up push notifications:", error);
                }
              }
            }
            
            // Only setup listeners once and store cleanup
            const cleanupListeners = setupMessageListeners();
          }

          setIsInitializing(false);
        } catch (error) {
          console.error("CometChat integration error:", error);
          setError(
            `Failed to connect to chat service: ${
              (error as Error).message || "Unknown error"
            }`
          );
          setIsInitializing(false);
        }
      };

      initCometChat();
    } else {
      setIsInitializing(false);
    }
    
    // Cleanup function for message listeners
    return () => {
      // Remove message listeners when component unmounts
      CometChat.removeMessageListener("notification_listener");
    };
  }, [isSignedIn, user]);

  // Clean up processed message IDs periodically to prevent memory leaks
  useEffect(() => {
    const clearOldMessages = () => {
      console.log("Clearing old processed message IDs");
      processedMessageIds.current = new Set();
    };
    
    // Clear the set every hour to prevent memory issues
    const interval = setInterval(clearOldMessages, 60 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isInitializing) {
    return (
      <div className="cometchat-loading">
        <div className="cometchat-loading-spinner"></div>
        Connecting to chat service...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: "15px", padding: "8px 16px", cursor: "pointer" }}>
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default CometChatClerkIntegration;
