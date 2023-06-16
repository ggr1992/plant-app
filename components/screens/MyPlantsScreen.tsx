import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import getUserDoc from "../utils/getUserDoc";

export function MyPlantsScreen() {
  const [loading, setLoading] = useState(true);
  const [savedPlants, setSavedPlants] = useState([]);
  let scrollViewRef = useRef(null);

  useEffect(() => {
    let name = "Bill";
    getUserDoc(name).then((plants: {}) => {
      const arr = [];
      Object.keys(plants).forEach((plant) => {
        arr.push(plants[plant]);
      });
      setLoading(false);
      setSavedPlants(arr);
    });
  }, []);

  const handleScrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
          >
            {savedPlants.map((plant) => (
              <View key={plant.id} style={styles.tile}>
                <View key={plant.common_name} style={styles.card}>
                  <Text key={plant.nickname} style={styles.nickname}>
                    {plant.nickname}
                  </Text>
                  <Image
                    key={plant.name}
                    source={{ uri: plant.Image }}
                    style={styles.image}
                  />
                  <Text key={plant.common_name} style={styles.name}>
                    {plant.common_name}
                  </Text>
                  <Text key={plant.type} style={styles.type}>
                    {plant.scientific_name}
                  </Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={handleScrollToTop}>
              <Text>Back to top</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingVertical: 20,
    overflow: "visible",
    backgroundColor: "#AAFFAA",
  },
  tile: {
    width: "40%",
    aspectRatio: 1,
    margin: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
  },
  type: {
    fontSize: 10,
  },
  nickname: {
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    position: "absolute",
    bottom: 75,
    left: 10,
    width: 100,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
  loading: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
  },
});
