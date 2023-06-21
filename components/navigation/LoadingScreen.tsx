import React, { useState } from "react";
import { Text, Image, View } from "react-native";
const image =
  "https://miro.medium.com/v2/resize:fit:1400/1*EAUw6VybtalCwakID4eNsQ.gif";

const LoadingScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);

  if (loading) {
    return (
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 30 }}>
          Loading...
        </Text>
        <Image source={{ uri: image }} style={{ width: 400, height: 400 }} />
      </View>
    );
  }
  setLoading(false);
};

export default LoadingScreen;
