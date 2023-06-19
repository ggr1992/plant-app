import { useState } from "react";
import { auth, googleProvider } from "../Firebase_Config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup,signOut, signInWithEmailAndPassword} from "firebase/auth";

export const Auth = () => {
  const [email, setEmail] = useState();
  const [password, setpassword] = useState();
  const [loggedUser, setloggedUser] = useState();


  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setloggedUser(auth?.currentUser?.email)

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {setloggedUser(auth?.currentUser?.email)

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logOut = ()=>{
    signOut(auth)
    setloggedUser()


  }
}
 // return (
      //   <View>
      //     <TextInput
      //     placeholder="UserName"
      //     onChangeText={event => setUsername(event)}
      //     defaultValue={username}
      //   />
      //     <TextInput
      //       placeholder="Email...."
      //       onChangeText={event => setEmail(event)}
      //       defaultValue={email}
      //     />
      //     <TextInput
      //       placeholder="Password .."
      //       onChangeText={event => setpassword(event)}
      //       defaultValue={password}
      //     />
      //     <TextInput
      //       placeholder="Location"
      //       onChangeText={event => setpassword(event)}
      //       defaultValue={password}
      //     />
      //     <Button onClick={signUp}>Sign Up</Button>
      //     </View>
      // )
