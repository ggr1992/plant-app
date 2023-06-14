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

  return (
    <div>
      <input
        placeholder="Email...."
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        placeholder="Password .."
        onChange={(event) => setpassword(event.target.value)}
      />
      <button onClick={signUp}>Sign Up</button>
      <button onClick={signIn}>Sign In</button>
<br></br>
<br></br>
<br></br>
<button onClick={(signInWithGoogle)}>Sign in with Google</button>
<br></br>
<br></br>
{loggedUser}
<br></br>
<button onClick={logOut
}>Log Out</button>
    </div>
  );
};
