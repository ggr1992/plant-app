import { useState } from "react";
import { View, Text, TextInput, SafeAreaView, StyleSheet } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import data from "../../data/test-data/data";

export function AddPlantScreen() {
  const [plantList, setPlantList] = useState(data);
  const [userInput, setUserInput] = useState("");
  let plantNames = {};

  plantList.forEach((plant, index) => {
    plantNames[plant.common_name] = index;
    plant.other_name.forEach((name) => {
      plantNames[name] = index;
    });
  });

  let namesArray = Object.keys(plantNames);

  const filteredNames = namesArray.filter((name) => {
    name.toLowerCase().includes(userInput.toLowerCase());
  });

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={styles.SearchBar}>
        <Autocomplete
          data={filteredNames}
          onChangeText={setUserInput}
          value={userInput}
          renderItem={({ item }) => (
            <View style={styles.SuggestionContainer}>
              <Text style={styles.suggestionText}>{item}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SearchBar: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  SuggestionContainer: {
    padding: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
  },
  suggestionList: {
    maxHeight: 200,
  },
});
