import { useContext, useEffect, useState } from "react";
import { View, Text,Image } from "react-native";
import getUserProfile from "../utils/getUser";
import { UserContext } from "../context/User";

type resultsType = {
  Avatar: string,
  Location: {
    longitude?: number,
    latitude?: number
  },
  Username: string
}

export function ProfileScreen() {
const [userName, setUserName] = useState<string>('');
const [location, setLocation] = useState<object>({});
const [avatar, setAvatar] = useState<string>('');

  const { userEmail } = useContext(UserContext);
  useEffect(() => {
    getUserProfile(userEmail).then((result:resultsType) => {
      setAvatar(result.Avatar);
      setLocation(result.Location);
      setUserName(result.Username)
    });
  },[])
  console.log(avatar)

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image style={{width:200,height:200}} source={{uri:avatar}}/>
      <Text>User Name: {userName}</Text>
      <Text>User Email: {userEmail}</Text>
      
   
    </View>
  );
}

