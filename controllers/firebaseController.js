// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC8p1bBZQZm4GY82lD2bWOMP4rucf5ZGQ",
  authDomain: "engaged-code-420923.firebaseapp.com",
  projectId: "engaged-code-420923",
  storageBucket: "engaged-code-420923.appspot.com",
  messagingSenderId: "570307538596",
  appId: "1:570307538596:web:a5f624c2117884e3aa0031",
  measurementId: "G-QEV6YD52KD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);