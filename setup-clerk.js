const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n=== Clerk Authentication Setup ===\n");
console.log(
  "This script will help you set up Clerk authentication for your CometChat app.\n"
);
console.log("To get your Clerk publishable key:");
console.log("1. Create an account at https://clerk.com");
console.log("2. Create a new application in the Clerk dashboard");
console.log("3. Set up Google OAuth in the Social Connections section");
console.log("4. Get your publishable key from the API Keys section\n");

rl.question("Enter your Clerk publishable key: ", (clerkKey) => {
  if (!clerkKey || clerkKey.trim() === "") {
    console.log("\n❌ Error: Clerk publishable key is required.\n");
    rl.close();
    return;
  }

  const envContent = `# Clerk Authentication Key
REACT_APP_CLERK_PUBLISHABLE_KEY=${clerkKey.trim()}

# CometChat App ID and Auth Key
# These should already be set in your environment
`;

  const envPath = path.join(process.cwd(), ".env.local");

  try {
    fs.writeFileSync(envPath, envContent);
    console.log(
      "\n✅ Success! Created .env.local file with your Clerk publishable key."
    );
    console.log(
      "\nImportant: Restart your development server for changes to take effect.\n"
    );
  } catch (error) {
    console.error("\n❌ Error creating .env.local file:", error.message);
    console.log(
      "\nManually create a .env.local file in the project root with the following content:"
    );
    console.log("\nREACT_APP_CLERK_PUBLISHABLE_KEY=" + clerkKey.trim() + "\n");
  }

  rl.close();
});

rl.on("close", () => {
  console.log("Setup complete. Happy coding!\n");
});
