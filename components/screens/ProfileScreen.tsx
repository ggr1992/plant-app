import { useContext, useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import getUserDoc from "../utils/getUserDoc";
import { UserContext } from "../context/User";

export function ProfileScreen({ navigation }) {
  const [successfullLogOut, setSuccessfulLogout] = useState<boolean>(false);
  const { userEmail } = useContext(UserContext);

  if (!userEmail) {
    return <Text style={styles.signInMessage}>Please Sign In!</Text>;
  } else {
    useEffect(() => {
      if (successfullLogOut) {
        setSuccessfulLogout(true);
      } else {
        getUserDoc(userEmail)
        .then((result: object[]) => {
          console.log(result)
        })
      }
    }, [userEmail, successfullLogOut]);

    const handleLogOut = () => {
      setSuccessfulLogout(true);
      navigation.navigate("Login Page");
    };

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Account email: {userEmail}</Text>
        <Pressable style={styles.button} onPress={handleLogOut}>
          <Text>Logout</Text>
        </Pressable>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginBottom: 10,
  },
  signInMessage: {
    textAlign: "center",
    fontSize: 30,
    justifyContent: "center",
    top: "50%",
    fontWeight: "bold",
  },
});
