import { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import getUserProfile from "../utils/getUser";
import { UserContext } from "../context/User";
import { db } from "../../Firebase_Config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export function ProfileScreen() {
  const [email, setEmail] = useState("");

  const { userEmail } = useContext(UserContext);

  getUserProfile(userEmail).then((result) => {
    console.log(result);
    return result;
  });
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{userEmail}</Text>
    </View>
  );
}
