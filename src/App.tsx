import "./styles/App.css";
import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { CometChatHome } from "./components/CometChatHome/CometChatHome";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import ClerkAuth from "./components/ClerkAuth/ClerkAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import CometChatClerkIntegration from "./components/CometChatIntegration/CometChatClerkIntegration";

// Your Clerk publishable key - replace with your actual key from the Clerk dashboard
const CLERK_PUBLISHABLE_KEY =
  "pk_test_dGhhbmtmdWwtd2FsbGV5ZS0yNy5jbGVyay5hY2NvdW50cy5kZXYk";

if (!CLERK_PUBLISHABLE_KEY) {
  console.error("Missing REACT_APP_CLERK_PUBLISHABLE_KEY environment variable");
}

interface IAppProps {
  loggedInUser?: CometChat.User;
  theme?: string;
}

// Component that handles the Clerk loading state
const ClerkStateHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="cometchat-loading">
        <div className="cometchat-loading-spinner"></div>
        Loading authentication...
      </div>
    );
  }

  return <>{children}</>;
};

function App(props: IAppProps) {
  const [clerkError, setClerkError] = useState<string | null>(null);
  const hasClerkKey = Boolean(CLERK_PUBLISHABLE_KEY);

  // Add error handler for global uncaught errors
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      if (event.error && event.error.toString().includes("Clerk")) {
        setClerkError(
          "Authentication system error. Please try refreshing the page."
        );
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // Display setup instructions if no Clerk key is provided
  if (!hasClerkKey) {
    return (
      <div className="clerk-setup-instructions">
        <h1>Clerk Setup Required</h1>
        <p>Please set up your Clerk publishable key:</p>
        <ol>
          <li>
            Create an account at{" "}
            <a
              href="https://clerk.com"
              target="_blank"
              rel="noopener noreferrer">
              https://clerk.com
            </a>
          </li>
          <li>Create a new application in the Clerk dashboard</li>
          <li>Set up Google OAuth in the Social Connections section</li>
          <li>Get your publishable key from the API Keys section</li>
          <li>
            Create a .env.local file in the project root with the following
            content:
          </li>
          <pre>REACT_APP_CLERK_PUBLISHABLE_KEY=your_actual_clerk_key</pre>
          <li>Restart your development server</li>
        </ol>
      </div>
    );
  }

  if (clerkError) {
    return (
      <div
        className="error-message"
        style={{
          margin: "100px auto",
          maxWidth: "600px",
          textAlign: "center",
        }}>
        <h2>Authentication Error</h2>
        <p>{clerkError}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: "8px 16px", marginTop: "20px", cursor: "pointer" }}>
          Refresh Page
        </button>
      </div>
    );
  }

  const AppContent = () => {
    return (
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY!}
        appearance={{
          elements: {
            formButtonPrimary: "clerk-primary-button",
            card: "clerk-card",
            formFieldInput: "clerk-form-input",
          },
        }}>
        <ClerkStateHandler>
          <AppContextProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<ClerkAuth />} />
              <Route path="/sign-up" element={<ClerkAuth />} />
              <Route
                path="home"
                element={
                  <ProtectedRoute>
                    <CometChatClerkIntegration>
                      <CometChatHome theme={props.theme} />
                    </CometChatClerkIntegration>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppContextProvider>
        </ClerkStateHandler>
      </ClerkProvider>
    );
  };

  return (
    <div>
      <div className="App">
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
