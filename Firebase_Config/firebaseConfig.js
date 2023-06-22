import {
  FIREBASE_APIKEY,
  FIREBASE_AUTHDOMAIN,
  FIREBASE_PROJECTID,
  FIREBASE_STORAGEBUCKET,
  FIREBASE_MESSAGINGSENDERID,
  FIREBASE_APPID,
  FIREBASE_MEASUREMENTID,
} from "@env";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp4IDjjgt6Ov3H08iCRue1AfwVBpMi_NY",

  authDomain: "happy-seeds-3cc72.firebaseapp.com",

  projectId: "happy-seeds-3cc72",

  storageBucket: "happy-seeds-3cc72.appspot.com",

  messagingSenderId: "594837030498",

  appId: "1:594837030498:web:8a5d78ad721c21fd9e333b",
};

console.log(firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
