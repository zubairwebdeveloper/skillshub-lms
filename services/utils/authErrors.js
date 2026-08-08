const FIREBASE_ERROR_MESSAGES = {
  "auth/email-already-in-use": "This email is already registered.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
};

export function getAuthErrorMessage(error) {
  const code = error?.code || "";
  return FIREBASE_ERROR_MESSAGES[code] || "Something went wrong. Please try again.";
}
