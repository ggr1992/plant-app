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
import {
  queryBySearchTerm,
  querySinglePlantByScientificName,
} from "../utils/api";

export function AddPlantScreen({ navigation, route }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [nickName, setNickName] = useState("");
  const [tempNickName, setTempNickName] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [selectedPlantWithId, setSelectedPlantWithId] = useState(null);

  useEffect(() => {
    if (searchTerm.length < 3) return;

    if (selectedPlant === null) {
      queryBySearchTerm(searchTerm).then((results) => {
        setFilteredPlants(results);
      });
    }

    if (searchTerm !== selectedPlant?.scientific_name[0]) {
      setSelectedPlant(null);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedPlant !== null) {
      querySinglePlantByScientificName(selectedPlant.scientific_name[0]).then(
        (plant) => {
          setSelectedPlantWithId({ ...selectedPlant, id: plant.id });
        }
      );
    }
  }, [selectedPlant]);

  useEffect(() => {
    if (route?.params?.plant) {
      setSearchTerm(route.params.plant.scientific_name[0]);
      setSelectedPlant(route.params.plant);
    }
  }, [route]);

  const addPlant = () => {
    setNickName(tempNickName);
    // TODO: get user based on context
    const user = "test_user";
    const plantId = selectedPlantWithId.id;
    addPlantToUser(user, plantId, nickName)
      .then(() => {
        setNickName("");
        setTempNickName("");
        setSelectedPlant(null);
        setSearchTerm("");
        navigation.navigate("My Plants Stack");
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
                      setSearchTerm(item.scientific_name[0]);
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
            source={{ uri: selectedPlant.image_url }}
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

