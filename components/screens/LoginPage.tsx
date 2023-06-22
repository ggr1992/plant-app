import { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useFonts } from "expo-font";
import signUp from "../utils/signUpData";
import signIn from "../utils/signInUser";
import { UserContext } from "../context/User";

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState<string>("");
  const [passwordSignUp, setPasswordSignUp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showSignUp, setShowSignup] = useState<Boolean>(false);

  const { setUserEmail } = useContext(UserContext);

  const [fontsLoaded] = useFonts({
    "BDO-Grotesk-Light": require("../../assets/BDOGrotesk-Light.ttf"),
    "BDO-Grotesk-Reg": require("../../assets/BDOGrotesk-Regular.ttf"),
    "BDO-Grotesk-Med": require("../../assets/BDOGrotesk-Medium.ttf"),
    "BDO-Grotesk-Bold": require("../../assets/BDOGrotesk-Bold.ttf"),
  });

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
    signUp(email, passwordSignUp, location)
      .then(() => {
        setUserEmail(email);
        setEmail("");
        setEmail("");
        setPasswordSignUp("");
        setPassword("");

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
        setEmail("");
        setEmail("");
        setPasswordSignUp("");
        setPassword("");
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

  useEffect(() => {
    setErrorMsg("");
  }, [showSignUp]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo.png")} />
      {showSignUp === false && (
        <>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.credentialsInput}
              placeholder="Your Email"
              onChangeText={(text) => setEmail(text)}
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
            <Text style={styles.changeModeSectionText}>
              Don't have an account yet?
            </Text>
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
                onChangeText={(text) => setEmail(text)}
                value={email}
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
            <Text style={styles.changeModeSectionText}>
              Already have an account?
            </Text>
            <Text style={styles.changeModeText} onPress={toggleSignUp}>
              Click here to log in.
            </Text>
          </View>
        </>
      )}
      <ImageBackground
        style={styles.backgroundImage}
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
    height: 50,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 20,
    color: "#00745b",
    fontFamily: "BDO-Grotesk-Reg",
    fontSize: 16,
  },
  formButton: {
    width: 125,
    backgroundColor: "#009172",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  formButtonText: {
    color: "white",
    fontSize: 18,
    textTransform: "uppercase",
    fontFamily: "BDO-Grotesk-Bold",
  },
  changeModeContainer: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
  },
  changeModeSectionText: {
    fontSize: 14,
    fontFamily: "BDO-Grotesk-Light",
  },
  changeModeText: {
    color: "#009172",
    fontSize: 14,
    fontFamily: "BDO-Grotesk-Med",
  },
  errorMessage: {
    marginTop: 20,
    color: "red",
    fontFamily: "BDO-Grotesk-Reg",
    fontSize: 16,
  },
  backgroundImage: {
    width: 400,
    aspectRatio: 1,
    resizeMode: "contain",
  },
});

export default LoginScreen;
