import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Entypo } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { queryByScientificName } from "../utils/api";
import { capitalise } from "../utils/capitalise";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { identifyPlantFromPlantId } from "../utils/utils";

export function IdentifyPlantScreen({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [resultsWithMatchedData, setResultsWithMatchedData] = useState([]);

  const [fontsLoaded] = useFonts({
    "BDO-Grotesk-Light": require("../../assets/BDOGrotesk-Light.ttf"),
    "BDO-Grotesk-Reg": require("../../assets/BDOGrotesk-Regular.ttf"),
    "BDO-Grotesk-Med": require("../../assets/BDOGrotesk-Medium.ttf"),
    "BDO-Grotesk-Bold": require("../../assets/BDOGrotesk-Bold.ttf"),
  });

  useEffect(() => {
    if (results.length) {
      const scientificNames = results.map((res) => res.name);
      queryByScientificName(scientificNames)
        .then((dbMatches) => {
          const actualMatches = [];
          dbMatches.forEach((match) => {
            const currScientificName = match.scientific_name[0];
            const matchedResult = results.find((result) =>
              currScientificName.includes(result.name)
            );
            if (matchedResult) {
              actualMatches.push({
                ...match,
                probability: matchedResult.probability * 100,
              });
            }
          });
          setResultsWithMatchedData(actualMatches);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [results]);

  useEffect(() => {
    async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    };
  }, []);

  useEffect(() => {
    if (isLoading && image) {
      setIsLoading(true);
      setTimeout(() => {
        identifyPlantFromPlantId(image)
          .then((results) => {
            setResults(results.slice(0, 5));
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            setImage(null);
          });
      }, 3000);
    }
  }, [image, isLoading]);

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      let parentNav = navigation.getParent();
      parentNav.setOptions({
        tabBarStyle: { display: "none" },
      });
    });
  }, []);

  const takePicture = async () => {
    setImage(null);
    if (cameraRef) {
      try {
        setIsLoading(true);
        const data = await cameraRef.current.takePictureAsync({ base64: true });
        const compressedImage = await manipulateAsync(
          data.uri,
          [{ resize: { width: 600 } }],
          {
            compress: 0.5,
            format: SaveFormat.JPEG,
            base64: true,
          }
        );
        setImage(compressedImage);
        setErrorMsg("");
      } catch (err) {
        setErrorMsg("Could not identify plant! Please try again...");
        console.log(err);
      }
    }
  };

  const resetPicture = () => {
    setImage(null);
    setIsLoading(true);
  };

  const addPlantManually = () => {
    navigation.navigate("App", {
      screen: "Add Plant Stack",
      params: {
        screen: "Add Plant",
      },
    });
  };

  const pickThisPlant = (plant) => {
    navigation.navigate("App", {
      screen: "Add Plant Stack",
      params: {
        screen: "Add Plant",
        params: {
          plant,
        },
      },
    });
  };

  if (hasCameraPermission === false) {
    return (
      <Text style={{ fontFamily: "BDO-Grotesk-Reg" }}>
        No access to camera!
      </Text>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
          <TouchableOpacity
            onPress={takePicture}
            style={styles.takePictureContainer}
          >
            <Image
              style={styles.takePictureIcon}
              source={require("../../assets/circle.png")}
            />
          </TouchableOpacity>
        </Camera>
      ) : (
        <View>
          {errorMsg.length > 0 && (
            <Text style={styles.errorMsg}>{errorMsg}</Text>
          )}
          {isLoading === true && (
            <View style={{ margin: 40 }}>
              <ImageBackground
                source={{ uri: image.uri }}
                style={styles.loadingBackgroundImage}
              >
                <Image
                  source={require("../../assets/loading-glass.gif")}
                  style={styles.loadingAnimatedIcon}
                />
              </ImageBackground>
              <Text style={styles.identifyingSubtext}>Identifying...</Text>
            </View>
          )}
          {isLoading === false && resultsWithMatchedData.length === 0 && (
            <View>
              <Text style={styles.searchResultHeader}>Oh no...</Text>
              <Text style={styles.searchResultSubtext}>
                Sorry, no matches found!
              </Text>
            </View>
          )}
          {isLoading === false && resultsWithMatchedData.length > 0 && (
            <ScrollView contentContainerStyle={styles.resultListContainer}>
              <Text style={styles.resultListHeader}>Matches</Text>
              {resultsWithMatchedData.map((result, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => pickThisPlant(result)}
                    style={styles.resultCard}
                  >
                    <ImageBackground
                      source={
                        result.image_url
                          ? { uri: result.image_url }
                          : require("../../assets/image-not-found.jpg")
                      }
                      imageStyle={{
                        borderRadius: 20,
                      }}
                      style={styles.resultCardImage}
                    >
                      <View>
                        <Text style={styles.resultCardName} numberOfLines={1}>
                          {capitalise(result.common_name) ??
                            capitalise(result.scientific_name)}
                        </Text>
                        <Text style={styles.resultCardProbability}>
                          {parseInt(result.probability)}%
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          {isLoading === false && (
            <>
              <TouchableOpacity
                onPress={resetPicture}
                style={styles.resetPictureButton}
              >
                <Entypo name="camera" size={28} color={"#333"} />
                <Text style={styles.tryAgainButton}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addPlantManually}
                style={styles.addPlantManuallyButton}
              >
                <Entypo name="edit" size={28} color={"#333"} />
                <Text style={styles.addPlantManuallyText}>
                  Add Plant Manually
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
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
    height: "auto",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3c635d",
  },
  takePictureContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 600,
  },
  takePictureIcon: { height: 96, width: 96 },
  errorMsg: { color: "red", fontFamily: "BDO-Grotesk-Med" },
  loadingBackgroundImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "center",
  },
  loadingAnimatedIcon: {
    position: "absolute",
    width: 200,
    resizeMode: "center",
    right: 0,
    bottom: -100,
    opacity: 0.6,
  },
  identifyingSubtext: {
    fontFamily: "BDO-Grotesk-Light",
    color: "#333",
    textAlign: "center",
    fontSize: 24,
    marginTop: 20,
  },
  searchResultHeader: {
    fontFamily: "BDO-Grotesk-Reg",
    fontSize: 36,
    textAlign: "center",
  },
  searchResultSubtext: {
    fontFamily: "BDO-Grotesk-Reg",
    fontSize: 24,
    textAlign: "center",
  },
  resultListContainer: {
    width: "100%",
    marginTop: 25,
    paddingBottom: 40,
  },
  resultListHeader: {
    fontFamily: "BDO-Grotesk-Reg",
    fontSize: 30,
    marginBottom: 10,
    textAlign: "center",
  },
  resultCard: {
    width: 300,
    height: 250,
    marginBottom: 20,
    elevation: 10,
  },
  resultCardImage: {
    width: "100%",
    height: "100%",
  },
  resultCardName: {
    fontFamily: "BDO-Grotesk-Med",
    backgroundColor: "black",
    opacity: 0.6,
    color: "#ffffff",
    width: "100%",
    fontSize: 20,
    paddingBottom: 10,
    position: "absolute",
    top: 190,
    paddingHorizontal: 10,
  },
  resultCardProbability: {
    fontFamily: "BDO-Grotesk-Bold",
    position: "absolute",
    backgroundColor: "black",
    opacity: 0.6,
    color: "#fff",
    padding: 10,
    fontSize: 20,
    top: 20,
    right: 0,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  resetPictureButton: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  tryAgainButton: {
    fontFamily: "BDO-Grotesk-Med",
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  addPlantManuallyButton: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  addPlantManuallyText: {
    fontFamily: "BDO-Grotesk-Med",
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
});
