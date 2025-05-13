import React, { useState } from "react";
import { SignIn, SignUp, useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../styles/CometChatLogin/CometChatLogin.css";

const ClerkAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const isSignUp = location.pathname.includes("sign-up");

  React.useEffect(() => {
    if (isSignedIn && user) {
      console.log("User is signed in, redirecting to home", user);
      navigate("/home");
    }
  }, [isSignedIn, navigate, user]);

  if (!isLoaded) {
    return (
      <div className="cometchat-loading">
        <div className="cometchat-loading-spinner"></div>
        Loading authentication...
      </div>
    );
  }

  const handleClerkError = (err: Error) => {
    console.error("Clerk authentication error:", err);
    setError("Authentication failed. Please try again.");
  };

  return (
    <div className="cometchat-login__container">
      <div className="cometchat-login__content">
        {error && (
          <div className="error-message">
            {error}
            <button
              onClick={() => setError(null)}
              className="telegram-button mt-2.5 mx-auto block"
              style={{
                padding: "5px 10px",
                fontSize: "14px",
              }}>
              Dismiss
            </button>
          </div>
        )}

        {isSignUp ? (
          <>
            <SignUp signInUrl="/login" />
          </>
        ) : (
          <>
            <SignIn signUpUrl="/sign-up" />
          </>
        )}
      </div>
    </div>
  );
};

export default ClerkAuth;
