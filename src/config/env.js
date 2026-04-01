// Configuration and API Keys Placeholder
// These can be replaced with actual keys for the backend integration

export const config = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  },
  ai: {
    openAiKey: import.meta.env.VITE_OPENAI_API_KEY || "", // Leave blank to use Mock AIService
  },
  maps: {
    googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "", // Leave blank to use mock/OpenStreetMap
  }
};
