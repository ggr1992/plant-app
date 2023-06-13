// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaKU-sTIG8FSMpYJce2XYCIxtSHeVRXtE",
  authDomain: "firedb-test-13c76.firebaseapp.com",
  projectId: "firedb-test-13c76",
  storageBucket: "firedb-test-13c76.appspot.com",
  messagingSenderId: "390571111779",
  appId: "1:390571111779:web:300dbea8ec950e538e8f56",
  measurementId: "G-0H6LB7ZQ8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app)