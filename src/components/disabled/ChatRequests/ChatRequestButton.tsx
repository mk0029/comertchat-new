import React, { useState, useContext, useEffect } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { getLocalizedString } from "@cometchat/chat-uikit-react";
import { CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";
import { AppContext } from "../../../context/AppContext";
import { sendChatRequest } from "./ChatRequestManager";

interface ChatRequestButtonProps {
  user: CometChat.User;
  className?: string;
}

const ChatRequestButton: React.FC<ChatRequestButtonProps> = ({
  user,
  className = "",
}) => {
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const { appState, setAppState } = useContext(AppContext);

  // Check if there's already a request for this user
  useEffect(() => {
    if (user && appState.pendingRequests) {
      const existingRequest = appState.pendingRequests.find(
        (req) =>
          req.receiver?.getUid() === user.getUid() &&
          req.sender?.getUid() ===
            CometChatUIKitLoginListener.getLoggedInUser()?.getUid()
      );

      if (existingRequest) {
        setRequestStatus(existingRequest.status);
      } else {
        setRequestStatus(null);
      }
    }
  }, [user, appState.pendingRequests]);

  // Handle sending a chat request
  const handleSendRequest = async () => {
    if (user) {
      // Set to "sending" state
      setRequestStatus("sending");

      // Send the chat request
      const success = await sendChatRequest(user);

      if (success) {
        // Add request to local state
        const currentUser = CometChatUIKitLoginListener.getLoggedInUser();
        if (currentUser) {
          setAppState({
            type: "addRequest",
            payload: {
              sender: currentUser,
              receiver: user,
              status: "pending",
              type: "user",
              timestamp: Date.now(),
            },
          });
          setRequestStatus("pending");
        }
      } else {
        setRequestStatus(null);
      }
    }
  };

  // Handle cancel request
  const handleCancelRequest = () => {
    if (user) {
      // Find the request to cancel
      const currentUser = CometChatUIKitLoginListener.getLoggedInUser();
      if (currentUser) {
        setAppState({
          type: "removeRequest",
          payload: {
            uid: user.getUid(),
            type: "user",
          },
        });
        setRequestStatus(null);
      }
    }
  };

  // Don't show the button if this is the current user
  const currentUser = CometChatUIKitLoginListener.getLoggedInUser();
  if (currentUser && user.getUid() === currentUser.getUid()) {
    return null;
  }

  // Return the appropriate button based on request status
  if (requestStatus === "pending") {
    return (
      <button
        className={`chat-request-button chat-request-button--pending ${className}`}
        onClick={handleCancelRequest}>
        {getLocalizedString("cancel_request") || "Cancel Request"}
      </button>
    );
  }

  if (requestStatus === "sending") {
    return (
      <button
        className={`chat-request-button chat-request-button--sending ${className}`}
        disabled>
        {getLocalizedString("sending") || "Sending..."}
      </button>
    );
  }

  return (
    <button
      className={`chat-request-button ${className}`}
      onClick={handleSendRequest}>
      {getLocalizedString("send_request") || "Send Request"}
    </button>
  );
};

export default ChatRequestButton;
