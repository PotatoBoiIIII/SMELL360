// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; // <-- Import isSupported
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { browser } from '$app/environment'; // <-- Import 'browser' from SvelteKit
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ74Ps5v6hZQudDc36Gf83V6Q5l55g3QM",
  authDomain: "smell360.firebaseapp.com",
  databaseURL: "https://smell360-default-rtdb.firebaseio.com",
  projectId: "smell360",
  storageBucket: "smell360.firebasestorage.app",
  messagingSenderId: "317518405107",
  appId: "1:317518405107:web:2c5bed058046c27630c686",
  measurementId: "G-JQVFVD91QR"
};

// Initialize Firebase App always (it's safe for both SSR and client)
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// Initialize Analytics ONLY if in the browser and analytics is supported
let analytics;
if (browser) { // <-- Check if running in the browser
    isSupported().then(yes => { // <-- Check if analytics is supported in this browser
        if (yes) {
            analytics = getAnalytics(app);
            console.log("Firebase Analytics initialized in browser.");
        } else {
            console.warn("Firebase Analytics is not supported or not initialized.");
        }
    });
}

const firebaseAuth = getAuth(app);
// Initialize Realtime Database and get a reference to the service (safe for both SSR and client)
const db = getDatabase(app);

// Export the instances
export default { app, analytics, db, storage,firebaseAuth };
