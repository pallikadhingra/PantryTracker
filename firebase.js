// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYXDSrlCMlujUaacnkWr2LyoocJHKPZV0",
  authDomain: "pantrytracker-cb4fd.firebaseapp.com",
  projectId: "pantrytracker-cb4fd",
  storageBucket: "pantrytracker-cb4fd.appspot.com",
  messagingSenderId: "128063524757",
  appId: "1:128063524757:web:93f0a095a8c87fa6fbf09c",
  measurementId: "G-93LGFQTNGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export {firestore}