import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKit, CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";
import { COMETCHAT_CONSTANTS } from "../../AppConstants";

interface CometChatClerkIntegrationProps {
  children: React.ReactNode;
}

const CometChatClerkIntegration: React.FC<CometChatClerkIntegrationProps> = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn && user) {
      // Initialize CometChat with the authenticated user
      const initCometChat = async () => {
        try {
          setIsInitializing(true);
          
          // Check if the user is already logged in to CometChat
          const currentUser = CometChatUIKitLoginListener.getLoggedInUser();
          
          if (!currentUser) {
            // Use Clerk user ID as the CometChat UID
            const uid = user.id;
            const name = user.fullName || 
                         `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
                         user.primaryEmailAddress?.emailAddress || 
                         uid;
            const avatar = user.imageUrl;
            
            // First check if user exists in CometChat
            try {
              const existingUser = await CometChat.getUser(uid);
              if (!existingUser) {
                throw new Error("User not found");
              }
              console.log("User already exists in CometChat:", existingUser);
            } catch (error) {
              // User doesn't exist, create a new user
              const authKey = COMETCHAT_CONSTANTS.AUTH_KEY || localStorage.getItem('authKey');
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
                // Continue anyway, as the user might already exist
              }
            }
            
            // Login to CometChat with the user ID
            await CometChatUIKit.login(uid);
            console.log("User logged in successfully to CometChat:", uid);
          }
          
          setIsInitializing(false);
        } catch (error) {
          console.error("CometChat integration error:", error);
          setError("Failed to connect to chat service. Please try again later.");
          setIsInitializing(false);
        }
      };

      initCometChat();
    } else {
      setIsInitializing(false);
    }
  }, [isSignedIn, user]);

  if (isInitializing) {
    return <div className="cometchat-loading">Connecting to chat service...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return <>{children}</>;
};

export default CometChatClerkIntegration; 