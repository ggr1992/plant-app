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
  const [displaySuggestions, setDisplaySuggestions] = useState(false);
  const [nickName, setNickName] = useState("");
  const [tempNickName, setTempNickName] = useState("");
  const [selectedPlant, setSelectedPlant] = useState({});

  useEffect(() => {
    getAllPlantNames().then((plants) => {
      setPlantList(plants);
    });
  }, []);

  useEffect(() => {
    if (route?.params?.query && searchTerm !== route.params.query) {
      setSearchTerm(route.params.query);
    }
  }, [route]);

  useEffect(() => {
    (async () => {
      if (searchTerm.length > 2) {
        setDisplaySuggestions(true);
      } else {
        setDisplaySuggestions(false);
      }
    })();
  }, [searchTerm]);

  const plantNamesRef = {};
  plantList.forEach((plant, index) => {
    plantNamesRef[plant.common_name] = index;
  });

  const namesArray = Object.keys(plantNamesRef);

  const filteredNames = [];

  namesArray.forEach((name) => {
    if (filteredNames.length === 0) {
      filteredNames.push(name);
    } else {
      if (plantNamesRef[filteredNames.at(-1)] !== plantNamesRef[name]) {
        filteredNames.push(name);
      }
    }
  });

  let autocompleteList = filteredNames.filter((name) => {
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (autocompleteList.length !== 0) {
    autocompleteList = autocompleteList.map((name: string) => {
      const index = plantNamesRef[name];
      let nameArr: string[] = name.split(" ");
      nameArr = nameArr.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      name = nameArr.join(" ");
      return {
        name: name,
        scientific_name: plantList[index]["scientific_name"],
        id: plantNamesRef[name],
      };
    });
  }

  const addPlant = () => {
    setSelectedPlant({});
    setNickName(tempNickName);
    const user = "test_user";
    const plantId = selectedPlant.id;
    addPlantToUser(user, plantId, nickName)
      .then(() => {
        setNickName("");
        setTempNickName("");
        setSelectedPlant({});
        setDisplaySuggestions(false);
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

        {displaySuggestions && (
          <FlatList
            style={styles.suggestionBox}
            data={autocompleteList}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    setSearchTerm(item.name);
                    setSelectedPlant(item);
                  }}
                >
                  <Text style={styles.suggestionText}>
                    {item.name}{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {item.scientific_name}
                    </Text>
                  </Text>
                </Pressable>
              );
            }}
          />
        )}
        <Button title="Add Plant" onPress={addPlant} color="green" />
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
