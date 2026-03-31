// Configuration and API Keys Placeholder
// These can be replaced with actual keys for the backend integration

export const config = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForHackathon",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "civiclens.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "civiclens",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "civiclens.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123:web:abc",
  },
  ai: {
    openAiKey: import.meta.env.VITE_OPENAI_API_KEY || "", // Leave blank to use Mock AIService
  },
  maps: {
    googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "", // Leave blank to use mock/OpenStreetMap
  }
};
