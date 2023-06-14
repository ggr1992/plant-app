import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { identifyPlant } from "../utils/utils";

export function IdentifyPlantScreen() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [res, setRes] = useState("");

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (photo && photo.hasOwnProperty("base64")) {
      console.log(photo.base64);
      identifyPlant(photo.base64).then((data) => {
        setRes(data);
      });
    }
  }, [photo]);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  return (
    <SafeAreaView style={styles.container}>
      {photo && photo.hasOwnProperty("base64") && (
        <Text>Photo: {photo?.base64}</Text>
      )}
      {/* {res !== undefined && <Text>response is: {JSON.stringify(res)}</Text>} */}
      {!photo && (
        <Camera style={styles.container} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <Button title="Take Pic" onPress={takePic} />
          </View>
          <StatusBar style="auto" />
        </Camera>
      )}

      {photo !== undefined && (
        <>
          <Image
            style={styles.preview}
            source={{ uri: "data:image/jpg;base64," + photo.base64 }}
          />

          <Button title="Try again" onPress={() => setPhoto(undefined)} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 0.5,
  },
});
