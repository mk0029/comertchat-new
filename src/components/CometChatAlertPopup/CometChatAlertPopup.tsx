import React from 'react';
import { CometChatButton } from '@cometchat/chat-uikit-react';
import '../../styles/CometChatAlertPopup/CometChatAlertPopup.css';

interface AlertPopupProps {
  title: string;
  description: string;
  confirmButtonText?: string;
  onConfirmClick: () => void;
}

const CometChatAlertPopup: React.FC<AlertPopupProps> = (props) => {
  const {
    title,
    description,
    confirmButtonText = 'OK',
    onConfirmClick
  } = props;

  return (
    <div className="cometchat-alert-popup">
      <div className="cometchat-alert-popup__content">
        <div className="cometchat-alert-popup__title">{title}</div>
        <div className="cometchat-alert-popup__description">{description}</div>
        <div className="cometchat-alert-popup__actions">
          <CometChatButton 
            text={confirmButtonText}
            onClick={onConfirmClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CometChatAlertPopup;