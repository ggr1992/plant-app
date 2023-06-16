import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import addPlantToUser from "../utils/addPlantToUser";
import getAllPlantNames from "../utils/getAllPlantNames";

export function AddPlantScreen({ navigation, route }) {
  const [plantList, setPlantList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nickName, setNickName] = useState("");
  const [tempNickName, setTempNickName] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filteredPlants, setFilteredPlants] = useState([]);

  useEffect(() => {
    getAllPlantNames().then((plants) => {
      setPlantList(plants);
    });
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      if (
        selectedPlant !== null &&
        searchTerm !== selectedPlant.scientific_name
      ) {
        setSelectedPlant(null);
      }
      setFilteredPlants(() => {
        return plantList.filter((plant) => {
          const searchTermLowerCase = searchTerm.toLowerCase();
          const scientificNameLowerCase = plant.scientific_name.toLowerCase();
          const commonNameLowerCase = plant.common_name.toLowerCase();
          return (
            scientificNameLowerCase.includes(searchTermLowerCase) ||
            commonNameLowerCase.includes(searchTermLowerCase)
          );
        });
      });
    }
  }, [searchTerm]);

  useEffect(() => {
    if (route?.params?.query && searchTerm !== route.params.query) {
      setSearchTerm(route.params.query);
    }
  }, [route]);

  const addPlant = () => {
    setNickName(tempNickName);
    const user = "test_user";
    const plantId = selectedPlant.id;
    addPlantToUser(user, plantId, nickName)
      .then(() => {
        setNickName("");
        setTempNickName("");
        setSelectedPlant(null);
        setSearchTerm("");
        navigation.navigate("My plants");
      })
      .catch(() => {
        console.log("Could not add plant...");
      });
  };

  const identifyPlant = () => {
    setSearchTerm("");
    navigation.navigate("Identify Plant");
  };

  return (
    <SafeAreaView style={styles.formStyle}>
      <Text style={styles.Title}>Add A Plant</Text>
      <View style={styles.Information}>
        <View>
          <Text style={styles.nickNameDisplay}>{nickName}</Text>
        </View>
        <View style={styles.container}>
          <TextInput
            placeholder="Give it a nickname..."
            value={tempNickName}
            onChangeText={setTempNickName}
            style={styles.nickNameInput}
          ></TextInput>
          <TextInput
            placeholder="Search for a plant..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchBox}
          />
        </View>

        {searchTerm.length > 2 &&
          filteredPlants.length > 0 &&
          selectedPlant === null && (
            <FlatList
              style={styles.suggestionBox}
              data={filteredPlants}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    onPress={() => {
                      setSelectedPlant(item);
                      setSearchTerm(item.scientific_name);
                    }}
                  >
                    <Text style={styles.suggestionText}>
                      {item.common_name}{" "}
                      <Text style={{ fontWeight: "bold" }}>
                        {item.scientific_name}
                      </Text>
                    </Text>
                  </Pressable>
                );
              }}
            />
          )}
        {selectedPlant !== null && (
          <Image
            source={{ uri: selectedPlant.image }}
            style={{ width: 200, height: 200 }}
          />
        )}
        {selectedPlant === null && <Text>Select a plant to continue...</Text>}
        {selectedPlant !== null && (
          <Button title="Add Plant" onPress={addPlant} color="green" />
        )}
        <Button
          title="Reset"
          onPress={() => {
            setSearchTerm("");
            setSelectedPlant(null);
          }}
          color="#da5da5"
        />
        <Button
          title="Identify with camera"
          onPress={identifyPlant}
          color="blue"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    justifySelf: "flex-start",
    backgroundColor: "whitesmoke",
    overflow: "hidden",
  },
  searchBox: {
    padding: 10,
    borderColor: "black",
    borderRadius: 15,
    borderWidth: 2,
    fontSize: 18,
  },
  suggestionBox: {
    marginTop: 5,
    borderColor: "black",
    borderRadius: 15,
    borderWidth: 2,
    maxHeight: "30%",
  },
  suggestionText: {
    fontSize: 18,
  },
  nickNameInput: {
    padding: 10,
    borderColor: "black",
    borderRadius: 15,
    borderWidth: 2,
    fontSize: 18,
    marginBottom: 5,
  },
  nickNameDisplay: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  camera: {
    height: 200,
    width: "100%",
    marginTop: 10,
  },
  capturedImage: {
    width: 250,
    height: 250,
  },
  formStyle: {
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    margin: 0,
    backgroundColor: "lightgreen",
    overflow: "hidden",
  },
  Information: {
    backgroundColor: "whitesmoke",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    borderRadius: 25,
    flex: 1,
  },
  Button: {
    borderWidth: 3,
  },
  Title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
});
