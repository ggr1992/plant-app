import { auth, googleProvider } from "../../Firebase_Config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup,signOut, signInWithEmailAndPassword} from "firebase/auth";
import { setDoc ,doc} from "firebase/firestore";
import { db } from "../../Firebase_Config/firebaseConfig";
    
    const signUp = (email,password,location,username,avatar) => {
       return createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            return setDoc(doc(db, "Users", email, "Profile","userData"), {
            "Username":username,
            "Location":location,
            "Avatar":avatar} )})
          .catch((error) => {
        return "Email already in use"
          });
        }

module.exports = signUp



