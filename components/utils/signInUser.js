import {auth} from "../../Firebase_Config/firebaseConfig";
import { signInWithEmailAndPassword} from "firebase/auth";

const signIn = (email,password) => {
   return signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
      return "login successful"
      })
      .catch((error) => {
       return error.code
      });
  };

module.exports = signIn