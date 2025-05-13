import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { CometChatUIKit } from '@cometchat/chat-uikit-react';
import '../../styles/UserProfile.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';

const UserProfile: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      // Logout from CometChat
      await CometChatUIKit.logout();
    } catch (error) {
      console.error("Error logging out from CometChat:", error);
    }
    
    // Sign out from Clerk
    await signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="user-profile-container">
        <div className="user-profile-image">
          <img src={user.imageUrl} alt={user.firstName || 'User'} />
        </div>
        <div className="user-profile-info">
          <div className="user-profile-name">
            {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.id}
          </div>
          <div className="user-profile-email">
            {user.primaryEmailAddress?.emailAddress || ''}
          </div>
        </div>
        <DarkModeToggle />
        <button className="user-profile-logout ml-2" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 