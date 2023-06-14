import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";

export function AddPlantScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity>
        <Text
          onPress={() => navigation.navigate("add-plant-manual")}
          style={styles.button}
        >
          Add Plant Manually
        </Text>
        <Text
          onPress={() => navigation.navigate("identify-plant")}
          style={styles.button}
        >
          Identify Your Plant
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: "#225b4c",
    color: "#00ff7f",
    padding: 40,
    marginVertical: 20,
    fontFamily: "sans-serif",
    textAlign: "center",
    fontWeight: "bold",
  },
});
