import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Dialog from "react-native-dialog";
import { useFonts } from "expo-font";
import addPlantToUser from "../utils/addPlantToUser";
import { capitalise } from "../utils/capitalise";
import {
  queryBySearchTerm,
  querySinglePlantByScientificName,
} from "../utils/api";
import { Entypo } from "@expo/vector-icons";
import { UserContext } from "../context/User";
import LoadingScreen from "../navigation/LoadingScreen";

export function AddPlantScreen({ navigation, route }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [showNicknameInput, setShowNicknameInput] = useState(false);
  const { userEmail } = useContext(UserContext);

  const [fontsLoaded] = useFonts({
    "BDO-Grotesk-Light": require("../../assets/BDOGrotesk-Light.ttf"),
    "BDO-Grotesk-Reg": require("../../assets/BDOGrotesk-Regular.ttf"),
    "BDO-Grotesk-Med": require("../../assets/BDOGrotesk-Medium.ttf"),
    "BDO-Grotesk-Bold": require("../../assets/BDOGrotesk-Bold.ttf"),
  });

  useEffect(() => {
    if (searchTerm.length < 3) {
      setFilteredPlants([]);
    } else {
      queryBySearchTerm(searchTerm).then((results) => {
        setFilteredPlants(results.slice(0, 12));
      });
    }
  }, [searchTerm]);

  useEffect(() => {
    if (route?.params?.plant) {
      setSearchTerm(route.params.plant.scientific_name[0]);
    }
  }, [route]);

  const selectPlant = (plant) => {
    setShowNicknameInput(true);
    setSelectedPlant(plant);
  };

  const addPlant = () => {
    setShowNicknameInput(false);
    querySinglePlantByScientificName(selectedPlant.scientific_name[0])
      .then((result) => {
        return result.id;
      })
      .then((plantId) => {
        return addPlantToUser(userEmail, plantId, nickname);
      })
      .then(() => {
        setNickname("");
        setSelectedPlant(null);
        setSearchTerm("");
        navigation.navigate("My Plants", { refresh: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const identifyPlant = () => {
    setSearchTerm("");
    navigation.navigate("Identify Plant");
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <ScrollView style={styles.container}>
      <Dialog.Container visible={showNicknameInput}>
        <Dialog.Title>Nickname</Dialog.Title>
        <Dialog.Description>
          Do you want to give your plant a nickname (optional)?
        </Dialog.Description>
        <Dialog.Input
          value={nickname}
          onChangeText={(text) => setNickname(text)}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => setShowNicknameInput(false)}
        />
        <Dialog.Button label="Submit" onPress={addPlant} />
      </Dialog.Container>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
          placeholder="Search for a plant"
        ></TextInput>
        <Entypo
          name="cross"
          size={28}
          color={"#333"}
          style={styles.searchInputClearIcon}
          onPress={handleClearSearch}
        />
      </View>

      {searchTerm.length >= 3 && filteredPlants.length <= 0 && (
        <Text style={styles.resultStatusMsg}>
          Oh no... could not find any matching plants!
        </Text>
      )}

      <View style={styles.plantCardWrapper}>
        {filteredPlants.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => selectPlant(item)}
              style={styles.plantCardTouchable}
            >
              <ImageBackground
                source={
                  item.image_url
                    ? { uri: item.image_url }
                    : require("../../assets/image-not-found.jpg")
                }
                style={styles.plantCardBackgroundImage}
              >
                <Text style={styles.plantCardName} numberOfLines={2}>
                  {capitalise(item.common_name) ??
                    capitalise(item.scientific_name)}
                </Text>
                <Entypo
                  name="circle-with-plus"
                  size={48}
                  color={"#333"}
                  style={styles.addPlantIcon}
                />
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ marginBottom: 40 }}>
        <Text style={styles.identifyPlantHeader}>Identify Automatically</Text>
        <TouchableOpacity
          style={styles.identifyPlantIconContainer}
          onPress={identifyPlant}
        >
          <Image
            source={require("../../assets/magnifying-glass.png")}
            style={styles.identifyPlantIcon}
          />
        </TouchableOpacity>
        <Text style={styles.identifyPlantDescription} numberOfLines={2}>
          Click the icon above to use your{"\n"}camera to identify your plant.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 50, marginBottom: 60, padding: 5 },
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
  identifyPlantHeader: {
    alignSelf: "center",
    fontSize: 20,
    marginTop: 40,
    marginBottom: 10,
    fontWeight: "bold",
  },
  identifyPlantDescription: { alignSelf: "center", textAlign: "center" },
  identifyPlantIconContainer: {
    width: 100,
    height: 100,
    alignSelf: "center",
    margin: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,.3)",
    padding: 20,
    borderRadius: 100,
  },
  identifyPlantIcon: {
    width: "100%",
    height: "100%",
    transform: [{ scaleX: -1 }, { scaleY: 1 }],
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
});
