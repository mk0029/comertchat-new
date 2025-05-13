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
      <div className="cometchat-login__content" style={{ paddingTop: "20px" }}>
        {error && (
          <div className="error-message" style={{ marginBottom: "15px" }}>
            {error}
            <button
              onClick={() => setError(null)}
              style={{
                display: "block",
                margin: "10px auto 0",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
              }}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {isSignUp ? (
          <>
            <SignUp signInUrl="/login" />
            <div className="cometchat-login__signup-section">
              <span>Already have an account?</span>
              <Link to="/login" className="cometchat-login__signup-link">
                Sign in
              </Link>
            </div>
          </>
        ) : (
          <>
            <SignIn signUpUrl="/sign-up" />
            <div className="cometchat-login__signup-section">
              <span>Don't have an account?</span>
              <Link to="/sign-up" className="cometchat-login__signup-link">
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClerkAuth; 