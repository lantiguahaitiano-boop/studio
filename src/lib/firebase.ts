// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "lumenai-web",
  "appId": "1:914308373254:web:ddee058ef2b7d4029e9c87",
  "storageBucket": "lumenai-web.firebasestorage.app",
  "apiKey": "AIzaSyDyME0SUPdILxT85FHGYrIwDpsgWx1O6V4",
  "authDomain": "lumenai-web.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "914308373254"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, sendEmailVerification, sendPasswordResetEmail };
