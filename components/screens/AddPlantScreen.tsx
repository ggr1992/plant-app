import { useState, useEffect } from "react";
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

export function AddPlantScreen({ navigation, route }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [showNicknameInput, setShowNicknameInput] = useState(false);

  const [fontsLoaded] = useFonts({
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
    // TODO: get user based on context
    setShowNicknameInput(false);
    let plantId;
    const user = "test_user";
    querySinglePlantByScientificName(selectedPlant.scientific_name[0])
      .then((result) => {
        plantId = result.id;
      })
      .then(() => {
        return addPlantToUser(user, plantId, nickname);
      })
      .then(() => {
        setNickname("");
        setSelectedPlant(null);
        setSearchTerm("");
        navigation.navigate("My Plants Stack");
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
    <ScrollView style={{ marginTop: 40, marginBottom: 60, padding: 20 }}>
      <Dialog.Container visible={showNicknameInput}>
        <Dialog.Title>Nickname</Dialog.Title>
        <Dialog.Description>
          Do you want to give your plant a nickname (optional)?
        </Dialog.Description>
        <Dialog.Input
          value={nickname}
          onChangeText={(text) => setNickname(text)}
        />
        <Dialog.Button label="Submit" onPress={addPlant} />
        <Dialog.Button
          label="Cancel"
          onPress={() => setShowNicknameInput(false)}
        />
      </Dialog.Container>
      <View>
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
          style={{ position: "absolute", right: 14, top: 16, color: "red" }}
          onPress={handleClearSearch}
        />
      </View>

      {searchTerm.length >= 3 && filteredPlants.length <= 0 && (
        <Text style={{ color: "#b0112b", alignSelf: "center", fontSize: 16 }}>
          Oh no... could not find any matching plants!
        </Text>
      )}
      <FlatList
        style={{
          flexDirection: "row",
          width: "100%",
          marginBottom: 20,
        }}
        numColumns={2}
        data={filteredPlants}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => selectPlant(item)}
              style={{
                width: 172,
                aspectRatio: 1,
                margin: 6,
              }}
            >
              <ImageBackground
                source={
                  item.image_url
                    ? { uri: item.image_url }
                    : require("../../assets/image-not-found.jpg")
                }
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: "BDO-Grotesk-Med",
                    backgroundColor: "rgba(0,0,0,.4)",
                    color: "#fff",
                    width: "100%",
                    fontSize: 16,
                    paddingBottom: 10,
                    position: "absolute",
                    top: 0,
                    paddingHorizontal: 10,
                  }}
                  numberOfLines={2}
                >
                  {capitalise(item.common_name) ??
                    capitalise(item.scientific_name)}
                </Text>
                <Entypo
                  name="circle-with-plus"
                  size={48}
                  color={"#333"}
                  style={{
                    position: "absolute",
                    right: 4,
                    bottom: 4,
                    color: "rgba(255,255,255,.8)",
                  }}
                />
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
      />
      <View style={{ marginBottom: 40 }}>
        <Text
          style={{
            alignSelf: "center",
            fontSize: 20,
            marginTop: 40,
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          Identify Automatically
        </Text>
        <TouchableOpacity
          style={{
            width: 100,
            height: 100,
            alignSelf: "center",
            margin: 10,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: "rgba(0,0,0,.3)",
            padding: 20,
            borderRadius: 100,
          }}
          onPress={identifyPlant}
        >
          <Image
            source={require("../../assets/magnifying-glass.png")}
            style={{
              width: "100%",
              height: "100%",
              transform: [{ scaleX: -1 }, { scaleY: 1 }],
            }}
          />
        </TouchableOpacity>
        <Text
          style={{ alignSelf: "center", textAlign: "center" }}
          numberOfLines={2}
        >
          Click the icon above to use your{"\n"}camera to identify your plant.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
