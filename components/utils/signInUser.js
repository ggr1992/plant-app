import {auth} from "../../Firebase_Config/firebaseConfig";
import { signInWithEmailAndPassword} from "firebase/auth";

export function signIn  (email,password)  {
   return signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
         return {success: true, message: 'Login successful' }
      })
  };

export default signIn