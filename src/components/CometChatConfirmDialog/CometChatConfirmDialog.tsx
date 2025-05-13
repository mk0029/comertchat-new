import React from "react";
import { CometChatButton } from "@cometchat/chat-uikit-react";
import "../../styles/CometChatConfirmDialog/CometChatConfirmDialog.css";

interface ConfirmDialogProps {
  title: string;
  messageText: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  onCancelClick: () => void;
  onSubmitClick: () => Promise<void>;
}

const CometChatConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  const {
    title,
    messageText,
    confirmButtonText,
    cancelButtonText = "Cancel",
    onCancelClick,
    onSubmitClick,
  } = props;

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitClick();
    } catch (error) {
      console.error("Error during confirmation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cometchat-confirm-dialog">
      <div className="cometchat-confirm-dialog__content">
        <div className="cometchat-confirm-dialog__title">{title}</div>
        <div className="cometchat-confirm-dialog__message">{messageText}</div>
        <div className="cometchat-confirm-dialog__actions">
          <CometChatButton
            text={cancelButtonText}
            onClick={onCancelClick}
            disabled={isSubmitting}
          />
          <CometChatButton
            text={confirmButtonText}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CometChatConfirmDialog; 