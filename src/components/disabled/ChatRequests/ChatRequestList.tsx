import React, { useContext } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import {
  CometChatListItem,
  CometChatButton,
  CometChatAvatar,
  getLocalizedString,
} from "@cometchat/chat-uikit-react";
import "../../styles/ChatRequests/ChatRequestList.css";
import { AppContext } from "../../../context/AppContext";

interface ChatRequestListProps {
  onItemClick?: (user: CometChat.User) => void;
}

const ChatRequestList: React.FC<ChatRequestListProps> = ({ onItemClick }) => {
  const { appState, setAppState } = useContext(AppContext);
  const pendingRequests = appState.pendingRequests.filter(
    (req) => req.status === "pending"
  );

  const handleAccept = async (request: any) => {
    try {
      // Update request status in app state
      setAppState({
        type: "updateRequestStatus",
        payload: {
          uid: request.sender.getUid(),
          type: request.type,
          status: "accepted",
        },
      });

      // Create a custom message to notify the sender
      const receiverID = request.sender.getUid();
      const messageType = "custom";
      const receiverType = CometChat.RECEIVER_TYPE.USER;

      const customData = {
        message: "Request accepted",
        type: "chat_request_accepted",
      };

      const customMessage = new CometChat.CustomMessage(
        receiverID,
        messageType,
        receiverType,
        customData
      );

      // Send notification to the user who sent the request
      await CometChat.sendCustomMessage(customMessage);

      // If it's a user request, open chat with the user
      if (request.type === "user") {
        // Get conversation with the user
        const conversation = await CometChat.getConversation(
          request.sender.getUid(),
          CometChat.RECEIVER_TYPE.USER
        );

        // Update selected item in app state
        setAppState({ type: "updateSelectedItem", payload: conversation });
        setAppState({
          type: "updateSelectedItemUser",
          payload: request.sender,
        });
        setAppState({ type: "updateActiveTab", payload: "chats" });
      }

      // If onItemClick is provided, call it
      if (onItemClick) {
        onItemClick(request.sender);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (request: any) => {
    try {
      // Update request status in app state
      setAppState({
        type: "updateRequestStatus",
        payload: {
          uid: request.sender.getUid(),
          type: request.type,
          status: "rejected",
        },
      });

      // Create a custom message to notify the sender
      const receiverID = request.sender.getUid();
      const messageType = "custom";
      const receiverType = CometChat.RECEIVER_TYPE.USER;

      const customData = {
        message: "Request rejected",
        type: "chat_request_rejected",
      };

      const customMessage = new CometChat.CustomMessage(
        receiverID,
        messageType,
        receiverType,
        customData
      );

      // Send notification to the user who sent the request
      await CometChat.sendCustomMessage(customMessage);

      // Remove the request after some time
      setTimeout(() => {
        setAppState({
          type: "removeRequest",
          payload: {
            uid: request.sender.getUid(),
            type: request.type,
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (pendingRequests.length === 0) {
    return (
      <div className="chat-requests-empty">
        <p>{getLocalizedString("no_requests") || "No pending requests"}</p>
      </div>
    );
  }

  return (
    <div className="chat-requests-list">
      {pendingRequests.map((request, index) => (
        <div
          key={`${request.sender.getUid()}-${index}`}
          className="chat-request-item">
          <CometChatListItem
            id={request.sender.getUid()}
            title={request.sender.getName()}
            avatarURL={request.sender.getAvatar()}
            avatarName={request.sender.getName()}
            subtitleView={
              <div className="chat-request-subtitle">
                {request.type === "user"
                  ? getLocalizedString("wants_to_chat") ||
                    "wants to chat with you"
                  : getLocalizedString("added_you_to_group") ||
                    "added you to a group"}
              </div>
            }
          />
          <div className="chat-request-actions">
            <div className="chat-request-accept-btn">
              <CometChatButton
                text={getLocalizedString("accept") || "Accept"}
                onClick={() => handleAccept(request)}
              />
            </div>
            <div className="chat-request-reject-btn">
              <CometChatButton
                text={getLocalizedString("reject") || "Reject"}
                onClick={() => handleReject(request)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatRequestList;
