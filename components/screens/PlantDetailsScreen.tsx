import {
  Text,
  ScrollView,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Pressable,
  Button,
  Alert,
} from "react-native";
import { useState, useEffect, useRef, useContext } from "react";
import { useFonts } from "expo-font";
import { getPlantInfo } from "../utils/getPlantsInfo";
import { capitalise } from "../utils/capitalise";
import Icon from "react-native-vector-icons/AntDesign";
import deleteAPlant from "../utils/deleteAPlant";
import { UserContext } from "../context/User";

export function PlantDetailsScreen({ navigation, route }) {
  const { userEmail } = useContext(UserContext);
  const scrollRef = useRef<ScrollView>();
  const [coordinate, setCoordinate] = useState(0);
  const { plantId, nickname } = route.params;
  const [plantDetails, setPlantDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [displayCareGuide, setDisplayCareGuide] = useState(false);

  const [fontsLoaded] = useFonts({
    "BDO-Grotesk-Light": require("../../assets/BDOGrotesk-Light.ttf"),
    "BDO-Grotesk-Reg": require("../../assets/BDOGrotesk-Regular.ttf"),
    "BDO-Grotesk-Med": require("../../assets/BDOGrotesk-Medium.ttf"),
    "BDO-Grotesk-Bold": require("../../assets/BDOGrotesk-Bold.ttf"),
  });

  const promptDelete = () => {
    Alert.alert(
      "Delete This Plant?",
      "Are you sure you want to delete this plant?",
      [
        { text: "OK", onPress: handleDelete },
        {
          text: "Cancel",
        },
      ]
    );
  };

  const handleDelete = () => {
    deleteAPlant(userEmail, nickname)
      .then(() => {
        navigation.navigate("My Plants", { refresh: true });
      })
      .catch((err) => {
        Alert.alert("Oops", "Could not delete plant! Try again later...");
      });
  };

  useEffect(() => {
    getPlantInfo(plantId.toString()).then((plant: object) => {
      plant = plant["obj"];
      plant["common_name"] = capitalise(plant["common_name"]);
      plant["scientific_name"] = plant["scientific_name"].map((name) =>
        capitalise(name)
      );
      if (plant["other_name"].length === 0) {
        delete plant["other_name"];
      } else {
        plant["other_name"] = plant["other_name"].map((name) =>
          capitalise(name)
        );
      }
      plant["watering"] = plant["watering"].toLowerCase();
      plant["sunlight"] = plant["sunlight"].map((string) => {
        return string.trim().toLowerCase();
      });
      if (plant["maintenance"]) {
        plant["maintenance"] = plant["maintenance"].toLowerCase();
      }
      plant["propagation"] = plant["propagation"].map((string) => {
        return string.trim().toLowerCase();
      });
      plant["soil"] = plant["soil"].map((string) => {
        return string.trim().toLowerCase();
      });
      setPlantDetails(plant);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (displayCareGuide === false) {
      setCoordinate(0);
    }
  }, [displayCareGuide]);

  useEffect(() => {
    if (coordinate) {
      scrollRef.current.scrollTo({ y: coordinate, animated: true });
    } else if (coordinate === 0) {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  }, [coordinate]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  function toggleDetails() {
    setDisplayCareGuide((displayCareGuide) => {
      return !displayCareGuide;
    });
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.page}>
      <SafeAreaView style={styles.containerWrapper}>
        <ScrollView contentContainerStyle={styles.container} ref={scrollRef}>
          <Text style={styles.headerText}>{plantDetails["common_name"]}</Text>
          <Text style={styles.headerTextBold}>
            {plantDetails["scientific_name"]}
          </Text>
          {plantDetails["other_name"] && (
            <Text style={styles.subHeaderText}>
              Also known as {plantDetails["other_name"].join(", ")}
            </Text>
          )}
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: plantDetails["image_url"] } as ImageSourcePropType}
            />
            <Pressable style={styles.deleteButton} onPress={promptDelete}>
              <Text style={styles.deleteText}>Delete Plant</Text>
            </Pressable>
          </View>
          {plantDetails["family"] && (
            <Text style={styles.bodyText}>
              <Text style={styles.sectionHeaderText}>Family: </Text>
              {plantDetails["family"]}
            </Text>
          )}
          <Text style={styles.bodyText}>
            <Text style={styles.sectionHeaderText}>Origin: </Text>
            {plantDetails["origin"].join(", ")}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.sectionHeaderText}>Type: </Text>
            {plantDetails["type"]}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.sectionHeaderText}>Dimension: </Text>
            {plantDetails["dimension"]}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.sectionHeaderText}>Indoor plant? </Text>
            {plantDetails["indoor"] ? "Yes" : "No"}
          </Text>
          <Text style={styles.descriptionText}>
            {plantDetails["plant_description"]}
          </Text>
          <Pressable onPress={toggleDetails}>
            <View
              style={{
                paddingLeft: 10,
                flexDirection: "row",
                columnGap: 15,
                alignItems: "center",
              }}
            >
              <View style={{ width: 30, height: 30 }}>
                <Icon
                  style={displayCareGuide && styles.iconActive}
                  name="down"
                  size={30}
                  color="black"
                ></Icon>
              </View>
              <Text style={styles.subHeaderText}>
                {displayCareGuide ? "Hide care guide" : "View care guide"}
              </Text>
            </View>
          </Pressable>
          {displayCareGuide && (
            <View
              style={{ flexDirection: "column", rowGap: 10 }}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                setCoordinate(layout.y - 10);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={styles.icon}
                  source={require("../../assets/watering.png")}
                />
                <Text style={styles.sectionHeaderText}>
                  {plantDetails["watering"]}
                </Text>
              </View>
              <Text style={styles.descriptionText}>
                {plantDetails["watering_description"]}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={styles.icon}
                  source={require("../../assets/sunlight.png")}
                />
                <Text style={styles.sectionHeaderText}>
                  {plantDetails["sunlight"].join(", ")}
                </Text>
              </View>
              <Text style={styles.descriptionText}>
                {plantDetails["sunlight_description"]}
              </Text>
              {plantDetails["pruning_description"] && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={styles.icon}
                      source={require("../../assets/pruning.png")}
                    />
                    <Text style={styles.sectionHeaderText}>
                      {plantDetails["maintenance"]} maintenance
                    </Text>
                  </View>
                  <Text style={styles.descriptionText}>
                    {plantDetails["pruning_description"]}
                  </Text>
                </>
              )}
              {plantDetails["soil"].length !== 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    style={styles.icon}
                    source={require("../../assets/soil.png")}
                  />
                  <Text style={styles.sectionHeaderText}>
                    {plantDetails["soil"].join(", ")}
                  </Text>
                </View>
              )}
              {plantDetails["propagation"] !== 0 && (
                <View
                  style={{
                    width: "80%",
                    flexDirection: "row",
                    columnGap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    style={styles.icon}
                    source={require("../../assets/planting.png")}
                  />
                  <Text style={styles.sectionHeaderText}>
                    {plantDetails["propagation"].join(", ")}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  containerWrapper: {
    marginBottom: 80,
  },
  container: {
    paddingTop: 5,
    paddingBottom: 10,
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    rowGap: 8,
  },
  imageContainer: {
    width: "100%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  deleteButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  deleteText: {
    color: 'red',
    fontFamily: 'BDO-Grotesk-Med',
    fontSize: 18
  },
  headerText: {
    fontFamily: "BDO-Grotesk-Med",
    fontSize: 24,
    textAlign: "center",
    color: "#009172",
  },
  headerTextBold: {
    fontFamily: "BDO-Grotesk-Bold",
    fontSize: 18,
    textAlign: "center",
  },
  subHeaderText: {
    fontFamily: "BDO-Grotesk-Reg",
    fontSize: 18,
    textAlign: "center",
  },
  sectionHeaderText: {
    fontFamily: "BDO-Grotesk-Bold",
    fontSize: 16,
  },
  bodyText: {
    fontFamily: "BDO-Grotesk-Reg",
    fontSize: 16,
    textAlign: "left",
  },
  descriptionText: {
    fontFamily: "BDO-Grotesk-Light",
    fontSize: 16,
    textAlign: "center",
  },
  iconActive: {
    transform: [{ rotate: "180deg" }],
  },
  icon: {
    width: 32,
    height: 32,
  },
});
