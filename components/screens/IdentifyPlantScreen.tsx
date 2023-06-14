import React, { useState, useEffect, useRef, Fragment } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Entypo } from "@expo/vector-icons";
import { identifyPlant } from "../utils/utils";

export function IdentifyPlantScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [bestMatch, setBestMatch] = useState("");

  useEffect(() => {
    async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    };
  }, []);

  useEffect(() => {
    if (isLoading && image) {
      identifyPlant(image).then((data) => {
        setBestMatch(data.bestMatch);
        setResults(data.results.slice(0, 5));
        setIsLoading(false);
      });
    }
  });

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
        setIsLoading(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const resetPicture = () => {
    setImage(null);
    setIsLoading(false);
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
              height: 40,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo name="camera" size={28} color={"#fff"} />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "#f1f1f1",
                marginLeft: 10,
              }}
            >
              Take Pic
            </Text>
          </TouchableOpacity>
        </Camera>
      ) : (
        <>
          {isLoading && (
            <Text style={{ color: "#333", marginBottom: 40 }}>
              Trying to identify plant... Please wait...
            </Text>
          )}
          {!isLoading && results.length === 0 && (
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
          <Text>Best match: {bestMatch}</Text>
          {results.map((result, index) => {
            return (
              <Fragment key={index}>
                <Text style={{ marginTop: 20 }}>
                  {(result.score * 100).toFixed(2)}%
                </Text>
                <Text>{result.species.scientificNameWithoutAuthor}</Text>
              </Fragment>
            );
          })}
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
    // flex: 1,
    borderRadius: 20,
    width: "50%",
    height: "50%",
  },
});
