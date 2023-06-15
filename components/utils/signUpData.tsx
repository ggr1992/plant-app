import { useState } from "react";
import { View, Text, TextInput,Button } from 'react-native'

import { auth, googleProvider } from "../../Firebase_Config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup,signOut, signInWithEmailAndPassword} from "firebase/auth";



export const SignUpFuntion = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setpassword] = useState();
    const [location, setLocation] = useState();
    const [avatar,setAvatar] = useState();
    const [username,setUsername] = useState();
    
    
    const signUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
      };
      
      //setDoc(doc(db, "Users", email, "Profile","userData"), result);

      return (
        <View>
          <TextInput
          placeholder="UserName"
          onChangeText={event => setUsername(event)}
          defaultValue={username}
        />
          <TextInput
            placeholder="Email...."
            onChangeText={event => setEmail(event)}
            defaultValue={email}
          />
          <TextInput
            placeholder="Password .."
            onChangeText={event => setpassword(event)}
            defaultValue={password}
          />
          <TextInput
            placeholder="Location"
            onChangeText={event => setpassword(event)}
            defaultValue={password}
          />
          <Button onClick={signUp}>Sign Up</Button>
          </View>
      )
}



