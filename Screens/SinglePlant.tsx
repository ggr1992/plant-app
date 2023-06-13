import { View, Text, StyleSheet, Image, Button, Alert } from "react-native";
import { Platform } from "react-native";

type Plant = {
  name: string;
  img: string;
  sunlight: string;
  water: string;
  description: string;
};

function SinglePlantPage(props: Plant) {
  return (
    <View style={styles.Container}>
      <View style={styles.Information}>
        <Text style={styles.Name}>{props.name}</Text>
        <Image source={{ uri: props.img }} style={styles.Img} />
        <Text style={styles.Description}>
          Plant Description: {props.description}
        </Text>
        <Text style={styles.Sunlight}>
          Reccommended Sunlight: {props.sunlight}
        </Text>
        <Text style={styles.Water}>Recommended Water: {props.water}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    borderColor: "black",
  },

  Information: {
    backgroundColor: "white",
    justifyContent: "space-evenly",
    textAlign: "center",
    borderColor: "black",
    borderWidth: 5,
    borderRadius: 50,
    height: 850,
    width: 400,
  },

  Name: {
    fontSize: Platform.OS === "android" ? 24 : 30,
    textAlign: "center",
  },
  Sunlight: {
    margin: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  Water: {
    margin: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  Description: {
    margin: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  Img: {
    width: 350,
    height: 400,
    margin: 20,
    borderRadius: 40,
    borderColor: "black",
    borderWidth: 2,
  },
});

export default SinglePlantPage;
