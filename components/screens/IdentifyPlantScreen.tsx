import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Entypo } from "@expo/vector-icons";
import { identifyPlant } from "../utils/utils";
import data from "../../data/development-data/data";

export function IdentifyPlantScreen({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [resultsWithMatchedData, setResultsWithMatchedData] = useState([]);

  useEffect(() => {
    if (results.length) {
      setResultsWithMatchedData(() => {
        return results.map((result) => {
          const scientificName = result.name;
          let imageUrl, commonName;
          const matchingPlantFromDb = data.find((plant) => {
            return plant.scientific_name[0].includes(scientificName);
          });
          if (matchingPlantFromDb?.image_url) {
            imageUrl = matchingPlantFromDb.image_url;
          }
          if (matchingPlantFromDb?.common_name) {
            commonName = matchingPlantFromDb.common_name;
          }
          return { ...result, imageUrl, commonName };
        });
      });
    }
  }, [results]);

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
      identifyPlant(image, "plantid")
        .then((results) => {
          setResults(results.slice(0, 5));
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
        const options = {
          quality: 0.5,
          base64: true,
          skipProcessing: true,
        };
        const data = await cameraRef.current.takePictureAsync(options);
        setImage(data);
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
    navigation.navigate("Add Plant");
  };

  const pickThisPlant = (name) => {
    navigation.navigate("Add Plant", { query: name });
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
              marginTop: 600,
            }}
          >
            <Entypo name="camera" size={120} color={"#fff"} />
          </TouchableOpacity>
        </Camera>
      ) : (
        <View style={{}}>
          {errorMsg.length > 0 && (
            <Text style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</Text>
          )}
          {isLoading === true && (
            <View>
              <Image source={require("../../assets/loading.gif")} />
              <Text
                style={{ color: "#333", marginBottom: 40, textAlign: "center" }}
              >
                Identifying...
              </Text>
            </View>
          )}

          {isLoading === false && resultsWithMatchedData.length > 0 && (
            <ScrollView
              style={{
                width: "100%",
                marginTop: 40,
                paddingBottom: 40,
              }}
            >
              <Text
                style={{ fontSize: 30, marginBottom: 10, textAlign: "center" }}
              >
                Matches
              </Text>
              {resultsWithMatchedData.map((result, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => pickThisPlant(result.name)}
                    style={{
                      width: 250,
                      height: 250,
                      marginBottom: 20,
                      shadowColor: "#52006A",
                      shadowOffset: { width: 10, height: 3 },
                      shadowOpacity: 50,
                      elevation: 10,
                    }}
                  >
                    <ImageBackground
                      source={
                        result.imageUrl
                          ? { uri: result.imageUrl }
                          : require("../../assets/image-not-found.jpg")
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            backgroundColor: "rgba(0,0,0,.4)",
                            color: "#fff",
                            width: "100%",
                            fontSize: 20,
                            paddingBottom: 10,
                            position: "absolute",
                            top: 200,
                          }}
                          numberOfLines={1}
                        >
                          {result.common_name ?? result.name}
                        </Text>
                        <Text
                          style={{
                            position: "absolute",
                            backgroundColor: "rgba(0,0,0,.4)",
                            color: "#fff",
                            padding: 10,
                            fontSize: 20,
                            top: 20,
                            right: 0,
                            borderTopLeftRadius: 20,
                            borderBottomLeftRadius: 20,
                            fontWeight: "bold",
                          }}
                        >
                          {parseInt(result.probability * 100)}%
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
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
                  marginBottom: 100,
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
            </ScrollView>
          )}
        </View>
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
