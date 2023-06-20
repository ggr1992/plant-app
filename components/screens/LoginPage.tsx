import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import signUp from "../utils/signUpData";
import signIn from "../utils/signInUser";
import { UserContext } from "../context/User";

export function LoginScreen({ navigation }) {
  const [emailSignUp, setEmailSignup] = useState<string>("");
  const [email, setEmailLogin] = useState<string>("");
  const [passwordSignUp, setPasswordSignUp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showSignUp, setShowSignup] = useState<Boolean>(false);

  const { setUserEmail } = useContext(UserContext);

  const handleSignup = () => {
    const statusMap = {
      "auth/invalid-email": "Invalid e-mail address!",
      "auth/missing-password": "Please enter a password!",
      "auth/weak-password": "Please enter a more secure password!",
      "auth/email-already-in-use":
        "An account already exists for that e-mail address!",
    };
    setErrorMsg("");
    let location = {
      latitude: 52.48,
      longitude: -1.9,
    };
    signUp(emailSignUp, passwordSignUp, location)
      .then(() => {
        setUserEmail(emailSignUp);
        navigation.navigate("App");
      })
      .catch((error) => {
        console.log(error);
        if (statusMap.hasOwnProperty(error.code)) {
          setErrorMsg(statusMap[error.code]);
        } else {
          setErrorMsg(error.code);
        }
      });
  };

  const handleLogin = () => {
    const statusMap = {
      "auth/invalid-email": "Invalid e-mail address!",
      "auth/missing-password": "Please enter a password!",
      "auth/user-not-found": "User not found!",
      "auth/wrong-password": "Wrong password!",
    };
    setErrorMsg("");
    signIn(email, password)
      .then(() => {
        setUserEmail(email);
        navigation.navigate("App");
      })
      .catch((error) => {
        if (error) {
          if (statusMap.hasOwnProperty(error.code)) {
            setErrorMsg(statusMap[error.code]);
          } else {
            setErrorMsg(error.code);
          }
        }
      });
  };

  const toggleSignUp = () => setShowSignup((prevVal) => !prevVal);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo.png")} />
      {showSignUp === false && (
        <>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.credentialsInput}
              placeholder="Your Email"
              onChangeText={(text) => setEmailLogin(text)}
              value={email}
            />
            <TextInput
              style={styles.credentialsInput}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry
            />
            <TouchableOpacity onPress={handleLogin} style={styles.formButton}>
              <Text style={styles.formButtonText}>Login</Text>
            </TouchableOpacity>
            {errorMsg !== "" && (
              <Text style={styles.errorMessage}>{errorMsg}</Text>
            )}
          </View>
          <View style={styles.changeModeContainer}>
            <Text>Don't have an account yet?</Text>
            <Text style={styles.changeModeText} onPress={toggleSignUp}>
              Click here to sign up.
            </Text>
          </View>
        </>
      )}

      {showSignUp === true && (
        <>
          <View style={styles.formContainer}>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.credentialsInput}
                placeholder="Your Email"
                onChangeText={(text) => setEmailSignup(text)}
                value={emailSignUp}
              />
              <TextInput
                style={styles.credentialsInput}
                placeholder="Password"
                onChangeText={(text) => setPasswordSignUp(text)}
                value={passwordSignUp}
                secureTextEntry
              />
              <TouchableOpacity
                onPress={handleSignup}
                style={styles.formButton}
              >
                <Text style={styles.formButtonText}>Sign-up</Text>
              </TouchableOpacity>
              {errorMsg !== "" && (
                <Text style={styles.errorMessage}>{errorMsg}</Text>
              )}
            </View>
            <View style={styles.changeModeContainer}></View>
            <Text>Already have an account?</Text>
            <Text style={styles.changeModeText} onPress={toggleSignUp}>
              Click here to log in.
            </Text>
          </View>
        </>
      )}
      <Image
        style={styles.backgroundFeature}
        source={require("../../assets/bg-leaf.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", height: "100%", backgroundColor: "#fff" },
  logo: {
    width: 300,
    height: 120,
    alignSelf: "center",
    marginTop: 100,
    marginBottom: 60,
  },
  formContainer: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  credentialsInput: {
    width: "60%",
    borderColor: "#009172",
    borderWidth: 2,
    borderRadius: 50,
    height: 40,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 20,
    color: "#00745b",
    fontWeight: "bold",
  },
  formButton: {
    width: "60%",
    backgroundColor: "#009172",
    height: 40,
    alignItems: "center",
    borderRadius: 50,
  },
  formButtonText: {
    color: "white",
    fontSize: 16,
    paddingTop: 10,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  changeModeContainer: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
  },
  changeModeText: { color: "#009172", fontWeight: "bold" },
  errorMessage: { marginTop: 10, color: "red" },
  backgroundFeature: {
    // backgroundColor: "red",
    // marginTop: 20,
    width: "100%",
    position: "absolute",
    bottom: -200,
    // marginHorizontal: 20,
    resizeMode: "contain",
  },
});

export default LoginScreen;
