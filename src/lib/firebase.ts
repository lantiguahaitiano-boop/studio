// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyME0SUPdILxT85FHGYrIwDpsgWx1O6V4",
  authDomain: "lumenai-web.firebaseapp.com",
  projectId: "lumenai-web",
  storageBucket: "lumenai-web.firebasestorage.app",
  messagingSenderId: "914308373254",
  appId: "1:914308373254:web:ddee058ef2b7d4029e9c87",
  measurementId: ""
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
