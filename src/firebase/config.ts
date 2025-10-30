// src/firebase/config.ts

// Firebase configuration using environment variables
// Make sure to create a .env file in the root directory with your Firebase credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// --- Firebase SDK Imports ---
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the initialized services for use across the application
export const auth = getAuth(app);
export const db = getFirestore(app);

// Utility function to generate the hidden email from Agent Name (for Auth login)
export const getAgentEmail = (agentName: string): string => {
    // We use a consistent, unique email tied to the Agent Name, but it's never shown to the user.
    return `${agentName.toLowerCase()}@sekretos.club`; 
};