import { auth, googleProvider } from "../../Firebase_Config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup,signOut, signInWithEmailAndPassword} from "firebase/auth";
import { setDoc ,doc} from "firebase/firestore";
import { db } from "../../Firebase_Config/firebaseConfig";
    
    export function signUp (email,password,location,username,avatar) {
       return createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            console.log('hello')
            return setDoc(doc(db, "Users", email, "Profile","userData"), {
              "Username":username,
              "Location":location,
              "Avatar":avatar} )})
            }

export default signUp



