import React, { useContext, useEffect } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { AppContext } from '../../context/AppContext';

interface ChatRequestManagerProps {
  children: React.ReactNode;
}

const ChatRequestManager: React.FC<ChatRequestManagerProps> = ({ children }) => {
  const { appState, setAppState } = useContext(AppContext);

  // Listen for custom messages related to chat requests
  useEffect(() => {
    const listenerId = "chat_request_listener_" + new Date().getTime();
    
    const customMessageListener = new CometChat.MessageListener({
      onCustomMessageReceived: (customMessage: CometChat.CustomMessage) => {
        // Use getData() method to get the data safely
        const data = customMessage.getData();
        
        // Handle chat request
        if (data?.type === 'chat_request') {
          const sender = customMessage.getSender();
          
          // Add to pending requests if not already there
          setAppState({
            type: "addPendingRequest",
            payload: {
              sender,
              sentAt: customMessage.getSentAt(),
              status: "pending",
              type: "user",
            }
          });
        }
        
        // Handle group request
        else if (data?.type === 'group_request') {
          const sender = customMessage.getSender();
          const group = data.group;

          // Add to pending requests if not already there
          setAppState({
            type: "addPendingRequest",
            payload: {
              sender,
              sentAt: customMessage.getSentAt(),
              status: "pending",
              type: "group",
              group
            }
          });
        }
        
        // Handle accepted request
        else if (data?.type === 'chat_request_accepted') {
          // Show notification or update UI as needed
          console.log("Chat request accepted");
        }
        
        // Handle rejected request
        else if (data?.type === 'chat_request_rejected') {
          // Show notification or update UI as needed
          console.log("Chat request rejected");
        }
      }
    });
    
    CometChat.addMessageListener(listenerId, customMessageListener);
    
    return () => {
      CometChat.removeMessageListener(listenerId);
    };
  }, [setAppState]);

  // Function to send a chat request to a user
  const sendChatRequest = async (user: CometChat.User) => {
    try {
      const receiverID = user.getUid();
      const messageType = "custom";
      const receiverType = CometChat.RECEIVER_TYPE.USER;
      
      const customData = { 
        message: "Would like to chat with you", 
        type: "chat_request" 
      };
      
      const customMessage = new CometChat.CustomMessage(
        receiverID, 
        messageType, 
        receiverType, 
        customData
      );
      
      await CometChat.sendCustomMessage(customMessage);
      
      return true;
    } catch (error) {
      console.error("Error sending chat request:", error);
      return false;
    }
  };

  // Function to send a group request to a user
  const sendGroupRequest = async (user: CometChat.User, group: CometChat.Group) => {
    try {
      const receiverID = user.getUid();
      const messageType = "custom";
      const receiverType = CometChat.RECEIVER_TYPE.USER;
      
      const customData = { 
        message: "Added you to group", 
        type: "group_request",
        group: {
          guid: group.getGuid(),
          name: group.getName(),
          type: group.getType(),
          icon: group.getIcon()
        }
      };
      
      const customMessage = new CometChat.CustomMessage(
        receiverID, 
        messageType, 
        receiverType, 
        customData
      );
      
      await CometChat.sendCustomMessage(customMessage);
      
      return true;
    } catch (error) {
      console.error("Error sending group request:", error);
      return false;
    }
  };

  return (
    <>
      {children}
    </>
  );
};

// Export the component and utility functions
export { ChatRequestManager, sendChatRequest, sendGroupRequest };

// Define these utility functions outside the component
const sendChatRequest = async (user: CometChat.User) => {
  try {
    const receiverID = user.getUid();
    const messageType = "custom";
    const receiverType = CometChat.RECEIVER_TYPE.USER;
    
    const customData = { 
      message: "Would like to chat with you", 
      type: "chat_request" 
    };
    
    const customMessage = new CometChat.CustomMessage(
      receiverID, 
      messageType, 
      receiverType, 
      customData
    );
    
    await CometChat.sendCustomMessage(customMessage);
    
    return true;
  } catch (error) {
    console.error("Error sending chat request:", error);
    return false;
  }
};

const sendGroupRequest = async (user: CometChat.User, group: CometChat.Group) => {
  try {
    const receiverID = user.getUid();
    const messageType = "custom";
    const receiverType = CometChat.RECEIVER_TYPE.USER;
    
    const customData = { 
      message: "Added you to group", 
      type: "group_request",
      group: {
        guid: group.getGuid(),
        name: group.getName(),
        type: group.getType(),
        icon: group.getIcon()
      }
    };
    
    const customMessage = new CometChat.CustomMessage(
      receiverID, 
      messageType, 
      receiverType, 
      customData
    );
    
    await CometChat.sendCustomMessage(customMessage);
    
    return true;
  } catch (error) {
    console.error("Error sending group request:", error);
    return false;
  }
}; 