import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { COMETCHAT_CONSTANTS } from './AppConstants';
import { CometChatUIKit, UIKitSettingsBuilder } from '@cometchat/chat-uikit-react';
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { metaInfo } from './metaInfo';
import { setupLocalization } from './utils/utils';

const getBrowserTheme = (): 'light' | 'dark' => {
  const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDarkTheme ? 'dark' : 'light';
};

// Initialize localization for the sample app and UI Kit.
setupLocalization();

// Render the React application
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <App theme={getBrowserTheme()} />
);

// Initialize CometChat if credentials are available
const initCometChat = async () => {
  const appID: string = COMETCHAT_CONSTANTS.APP_ID || (localStorage.getItem('appId') ?? "");
  const region: string = COMETCHAT_CONSTANTS.REGION || (localStorage.getItem('region') ?? "");
  const authKey: string = COMETCHAT_CONSTANTS.AUTH_KEY || (localStorage.getItem('authKey') ?? "");

  if (appID && region && authKey) {
    const uiKitSettings = new UIKitSettingsBuilder()
      .setAppId(appID)
      .setRegion(region)
      .setAuthKey(authKey)
      .subscribePresenceForAllUsers()
      .build();

    try {
      await CometChatUIKit.init(uiKitSettings);
      console.log('CometChat UI Kit initialized successfully');
      try { 
        CometChat.setDemoMetaInfo(metaInfo);
      } catch (err) { 
        console.error("Error setting demo meta info:", err);
      }
    } catch (error) {
      console.error('Error initializing CometChat:', error);
    }
  } else {
    console.log('CometChat credentials not found. Using Clerk authentication only.');
  }
};

// Initialize CometChat
initCometChat();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
