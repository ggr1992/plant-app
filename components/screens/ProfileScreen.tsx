import { useContext, useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import getUserProfile from "../utils/getUser";
import { UserContext } from "../context/User";

type resultsType = {
  Avatar: string;
  Location: {
    longitude?: number;
    latitude?: number;
  };
  Username: string;
};

export function ProfileScreen({ navigation }) {
  const [userName, setUserName] = useState<string>("");
  const [location, setLocation] = useState<object>({});
  const [avatar, setAvatar] = useState<string>("");
  const [successfullLogOut, setSuccessfulLogout] = useState<boolean>(false);

  const { userEmail } = useContext(UserContext);

  if (!userEmail) {
    return <Text style={styles.signInMessage}>Please Sign In!</Text>;
  } else {
    useEffect(() => {
      if (successfullLogOut) {
        setSuccessfulLogout(true);
      } else {
        getUserProfile(userEmail).then((result: resultsType) => {
          setAvatar(result.Avatar);
          setLocation(result.Location);
          setUserName(result.Username);
        });
      }
    }, [userEmail, successfullLogOut]);

    const handleLogOut = () => {
      setSuccessfulLogout(true);
      navigation.navigate("Login Page");
    };

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image style={{ width: 200, height: 200 }} source={{ uri: avatar }} />
        <Text>User Name: {userName}</Text>
        <Text>User Email: {userEmail}</Text>
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
