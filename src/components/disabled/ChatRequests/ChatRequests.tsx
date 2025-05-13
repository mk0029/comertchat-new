import React, { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { getLocalizedString } from "@cometchat/chat-uikit-react";
import ChatRequestList from "./ChatRequestList";
import "../../styles/ChatRequests/ChatRequests.css";

interface ChatRequestsProps {
  onItemClick?: (user: CometChat.User) => void;
  onBack?: () => void;
}

const ChatRequests: React.FC<ChatRequestsProps> = ({ onItemClick, onBack }) => {
  const { appState } = useContext(AppContext);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="chat-requests-container">
      <div className="chat-requests-header">
        {onBack && (
          <div className="chat-requests-back-button" onClick={handleBackClick}>
            <span className="chat-requests-back-icon"></span>
          </div>
        )}
        <div className="chat-requests-title">
          {getLocalizedString("requests") || "Requests"}
          {appState.requestsCount && appState.requestsCount > 0 && (
            <span className="chat-requests-count">
              {appState.requestsCount}
            </span>
          )}
        </div>
      </div>

      <div className="chat-requests-content">
        <ChatRequestList onItemClick={onItemClick} />
      </div>
    </div>
  );
};

export default ChatRequests;
