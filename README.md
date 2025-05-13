<p align="center">
  <img alt="CometChat" src="https://assets.cometchat.io/website/images/logos/banner.png">
</p>

# React Sample App by CometChat

This is a reference application showcasing the integration of [CometChat's React UI Kit](https://www.cometchat.com/docs/ui-kit/react/v6/overview) within a React framework. It provides developers with examples of implementing real-time messaging and voice and video calling features in their own React-based applications.

<div style="display: flex; align-items: center; justify-content: center">
   <img src="../screenshots/sample_app_overview.png" />
</div>

# CometChat with Clerk Authentication

This application integrates CometChat's messaging functionality with Clerk's modern authentication system, providing a seamless user experience.

## Clerk Authentication Setup

This app uses [Clerk](https://clerk.com) for authentication and user management. Clerk provides a secure and easy-to-use authentication system with features like:

- Social login (Google, Facebook, etc.)
- Email/password authentication
- Two-factor authentication
- User profile management

### Setup Instructions

1. Create an account at [Clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Set up the authentication methods you want (Google, GitHub, etc.)
4. Get your publishable key from the API Keys section in the Clerk dashboard
5. Run the setup script:
   ```
   npm run setup-clerk
   ```
6. Follow the prompts to enter your Clerk publishable key
7. Restart your development server

### How It Works

The app uses Clerk's authentication system and passes the Clerk user ID as the UID for CometChat. This allows for seamless integration between the two systems. When a user signs in with Clerk:

1. The Clerk user ID is used as the CometChat user ID
2. User profile information (name, avatar) is synced from Clerk to CometChat
3. CometChat sessions are automatically created and managed

To access the current user in your components:

```jsx
import { useUser } from "@clerk/clerk-react";

function MyComponent() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <img src={user.imageUrl} alt="Profile" />
    </div>
  );
}
```

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- A CometChat account and app (already set up)
- A Clerk.com account (free tier is available)

### Step 1: Set up Clerk

1. Create an account at [Clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. In the Clerk dashboard, go to **API Keys** and copy your **Publishable Key**
4. (Optional) Set up Google OAuth in the **Social Connections** section for social login

### Step 2: Configure the Application

Run the setup script to configure Clerk:

```bash
npm run setup-clerk
```

This will prompt you to enter your Clerk publishable key and create a `.env.local` file.

Alternatively, you can manually create a `.env.local` file in the project root with:

```
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Step 3: Start the Application

Start the development server:

```bash
npm start
```

## Features

- Modern authentication UI with Clerk
- Social login options (if configured in Clerk)
- Secure user management
- Seamless integration with CometChat
- Real-time messaging

## Troubleshooting

### Authentication Errors

If you see an error like `Cannot read properties of undefined (reading 'getAdminHost')`:

1. Make sure your Clerk publishable key is correctly set in `.env.local`
2. Ensure you've restarted the dev server after creating/updating `.env.local`
3. Check that your Clerk application is properly configured

### CometChat Connection Issues

If users can authenticate but CometChat doesn't connect:

1. Verify your CometChat credentials in your environment
2. Check that the integration between Clerk users and CometChat is working correctly

## Development

### Project Structure

- `/src/components/ClerkAuth` - Authentication components
- `/src/components/CometChatIntegration` - Integration between Clerk and CometChat
- `/src/components/CometChatHome` - Main chat interface

### Adding Features

When adding new features, ensure you properly handle authentication states using the Clerk hooks. See the `useAuth` and `useUser` hooks for available authentication information.

## Prerequisites

- Ensure that you have Node.js and npm installed:

  ```sh
    npm install npm@latest -g
  ```

- Sign up for a [CometChat](https://app.cometchat.com/) account to get your app credentials: _`App ID`_, _`Region`_, and _`Auth Key`_

## Installation

1. Clone the repository:

   ```sh
     git clone https://github.com/cometchat/cometchat-uikit-react.git
   ```

2. Checkout v6 branch:

   ```sh
     git checkout v6
   ```

3. Navigate to the cloned directory:
   ```sh
     cd cometchat-uikit-react/sample-app
   ```
4. Install dependencies:
   ```sh
     npm install
   ```
5. `[Optional]` Enter your CometChat _`App ID`_, _`Region`_, and _`Auth Key`_ in the [sample-app/src/AppConstants.ts](https://github.com/cometchat/cometchat-sample-app-react/blob/v6/sample-app/src/AppConstants.ts) file:https://github.com/cometchat/cometchat-uikit-react/blob/2dba5e2e781db6d2f20c59803ff7f8cef4e7c187/sample-app/src/AppConstants.ts#L1-L5

6. Run the project locally to see all CometChat features in action:
   ```
     npm start
   ```

## Help and Support

For issues running the project or integrating with our UI Kits, consult our [documentation](https://www.cometchat.com/docs/ui-kit/react/v6/integration) or create a [support ticket](https://help.cometchat.com/hc/en-us) or seek real-time support via the [CometChat Dashboard](http://app.cometchat.com/).
