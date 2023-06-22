import React, { useContext } from "react";
import { useEffect, useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import getUserDoc from "../utils/getUserDoc";
import { UserContext } from "../context/User";
import { useFonts } from "expo-font";
import { capitalise } from "../utils/capitalise";

export function MyPlantsScreen({ navigation, route }) {
  const { userEmail } = useContext(UserContext);
  const [savedPlants, setSavedPlants] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (route?.params?.refresh) {
      delete route.params.refresh;
      setRefreshing(true);
    }
  }, [route]);

  const [fontsLoaded] = useFonts({
    "BDO-Grotesk-Light": require("../../assets/BDOGrotesk-Light.ttf"),
    "BDO-Grotesk-Reg": require("../../assets/BDOGrotesk-Regular.ttf"),
    "BDO-Grotesk-Med": require("../../assets/BDOGrotesk-Medium.ttf"),
    "BDO-Grotesk-Bold": require("../../assets/BDOGrotesk-Bold.ttf"),
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (refreshing) {
        getUserDoc(userEmail)
          .then((plants: Object) => {
            const plantsArr = [];
            if (plants) {
              Object.keys(plants).forEach((plant) => {
                plantsArr.push(plants[plant]);
              });
            }
            plantsArr.sort((a, b) => {
              const nicknameA = a.nickname.toLowerCase();
              const nicknameB = b.nickname.toLowerCase();
              if (nicknameA > nicknameB) return 1;
              if (nicknameA < nicknameB) return -1;
              return 0;
            });
            setRefreshing(false);
            setSavedPlants(plantsArr);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 500);
  }, [refreshing]);

  useEffect(() => {
    setRefreshing(true);
  }, []);

  return (
    <>
      <Text style={styles.header}>My Plants</Text>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {savedPlants.length === 0 && (
          <Text
            style={{
              alignSelf: "center",
              marginVertical: 20,
              fontSize: 18,
              textAlign: "center",
              width: "60%",
            }}
          >
            No saved plants found! Click the button below to add a plant to your
            collection.
          </Text>
        )}
        <View style={styles.plantCardWrapper}>
          {savedPlants.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate("Plant Details", {
                    plantId: item.id,
                    nickname: item.nickname,
                  })
                }
                style={styles.plantCardTouchable}
              >
                <ImageBackground
                  source={
                    item.Image
                      ? { uri: item.Image }
                      : require("../../assets/image-not-found.jpg")
                  }
                  style={styles.plantCardBackgroundImage}
                >
                  <Text style={styles.plantCardName} numberOfLines={2}>
                    {capitalise(item.nickname) ?? capitalise(item.common_name)}
                  </Text>
                  <Entypo
                    name="magnifying-glass"
                    size={48}
                    color={"#333"}
                    style={styles.addPlantIcon}
                  />
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={{
            marginBottom: 200,
            marginTop: 60,
            backgroundColor: "rgba(255,255,255,.4)",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,.2)",
            width: 180,
            alignSelf: "center",
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("Add Plant Stack")}
        >
          <View style={styles.addPlantContainer}>
            <Entypo
              name="circle-with-plus"
              size={60}
              color={"#333"}
              style={{
                color: "#009172",
                position: "absolute",
                left: 5,
                top: 5,
              }}
            />
          </View>
          <Text style={styles.addPlantHeader}>Add New Plant</Text>
        </TouchableOpacity>
      </ScrollView>
      <Image
        source={require("../../assets/bg-leaf.png")}
        style={{
          position: "absolute",
          bottom: -300,
          zIndex: -1,
          transform: [{ scaleX: -1 }, { scaleY: 1 }],
        }}
      />
      <Image
        source={require("../../assets/bg-leaf2.png")}
        style={{
          position: "absolute",
          top: -330,
          right: -160,
          zIndex: -1,
          transform: [{ scaleX: 1 }, { scaleY: -1 }],
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  searchInputContainer: {
    paddingHorizontal: 15,
  },
  searchInput: {
    width: "100%",
    borderColor: "#009172",
    borderWidth: 2,
    borderRadius: 50,
    height: 60,
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 20,
    color: "#00745b",
    fontWeight: "bold",
    fontSize: 20,
  },
  searchInputClearIcon: {
    position: "absolute",
    right: 30,
    top: 16,
    color: "red",
  },
  addPlantHeader: {
    alignSelf: "center",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  addPlantDescription: { alignSelf: "center", textAlign: "center" },
  addPlantContainer: {
    width: 70,
    aspectRatio: 1,
    alignSelf: "center",
  },
  addPlantIcon: {
    position: "absolute",
    right: 4,
    bottom: 4,
    color: "rgba(255,255,255,.8)",
  },
  plantCardName: {
    fontFamily: "BDO-Grotesk-Med",
    backgroundColor: "rgba(0,0,0,.4)",
    color: "#fff",
    width: "100%",
    fontSize: 16,
    paddingBottom: 10,
    position: "absolute",
    top: 0,
    paddingHorizontal: 10,
  },
  plantCardWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  resultStatusMsg: { color: "#b0112b", alignSelf: "center", fontSize: 16 },
  plantCardTouchable: {
    width: 160,
    aspectRatio: 1,
    margin: 6,
  },
  plantCardBackgroundImage: {
    width: "100%",
    height: "100%",
  },
  header: {
    marginTop: 100,
    fontFamily: "BDO-Grotesk-Med",
    fontSize: 36,
    textAlign: "center",
    color: "#009172",
  },
});
