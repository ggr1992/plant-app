import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  useLayoutEffect,
} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Entypo } from "@expo/vector-icons";
import { identifyPlant } from "../utils/utils";

export function IdentifyPlantScreen({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      console.log(cameraStatus);
      setHasCameraPermission(cameraStatus.status === "granted");
    };
  }, []);

  useEffect(() => {
    if (isLoading && image) {
      identifyPlant(image)
        .then((data) => {
          setResults(data.results.slice(0, 5));
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setImage(null);
        });
    }
  });

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      let parentNav = navigation.getParent();
      parentNav.setOptions({
        tabBarStyle: { display: "none" },
      });
    });
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
        setIsLoading(true);
        setErrorMsg("");
      } catch (err) {
        setErrorMsg("Could not identify plant! Please try again...");
        console.log(err);
      }
    }
  };

  const resetPicture = () => {
    setImage(null);
    setIsLoading(false);
  };

  const addPlantManually = () => {
    navigation.navigate("Add Plant Manually");
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera!</Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
          <TouchableOpacity
            onPress={takePicture}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 700,
            }}
          >
            <Entypo name="camera" size={120} color={"#fff"} />
          </TouchableOpacity>
        </Camera>
      ) : (
        <>
          {errorMsg.length > 0 && (
            <Text style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</Text>
          )}
          {isLoading === true && (
            <>
              <Image source={require("../../assets/loading.gif")} />
              <Text style={{ color: "#333", marginBottom: 40 }}>
                Trying to identify plant... Please wait...
              </Text>
            </>
          )}
          {isLoading === false && results.length === 0 && (
            <>
              <Image source={{ uri: image }} style={styles.camera} />
              <TouchableOpacity
                onPress={resetPicture}
                style={{
                  height: 40,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Entypo name="circle-with-cross" size={28} color={"#333"} />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#333",
                    marginLeft: 10,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          )}
          {isLoading === false && results.length > 0 && (
            <>
              <Text style={{ fontSize: 20, marginBottom: 10 }}>Matches:</Text>
              {results.map((result, index) => {
                return (
                  <Fragment key={index}>
                    <Text style={{ fontSize: 16, padding: 20 }}>
                      {result.species.scientificNameWithoutAuthor} (
                      {(result.score * 100).toFixed(2)}%)
                    </Text>
                    <Text
                      style={{
                        backgroundColor: "#225b4c",
                        color: "#00ff7f",
                        padding: 10,
                        borderRadius: 20,
                        marginBottom: 10,
                        fontSize: 14,
                      }}
                    >
                      Pick This
                    </Text>
                  </Fragment>
                );
              })}
              <TouchableOpacity
                onPress={resetPicture}
                style={{
                  height: 40,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 40,
                }}
              >
                <Entypo name="camera" size={28} color={"#333"} />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#333",
                    marginLeft: 10,
                  }}
                >
                  Try Again
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addPlantManually}
                style={{
                  height: 40,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 40,
                }}
              >
                <Entypo name="edit" size={28} color={"#333"} />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#333",
                    marginLeft: 10,
                  }}
                >
                  Add Plant Manually
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "150%",
    height: undefined,
  },
});
