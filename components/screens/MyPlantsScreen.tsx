import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import getUserDoc from "../utils/getUserDoc";

export function MyPlantsScreen({ navigation }) {
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
    <View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loading}>Loading...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
          >
            {savedPlants.map((plant) => (
              <Pressable
                key={plant.id}
                style={styles.tile}
                onPress={() =>
                  navigation.navigate("Plant Details", {
                    plantId: plant.id,
                  })
                }
              >
                <View key={plant.id}>
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
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleScrollToTop}>
        <Text>Back to top</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    overflow: "visible",
    backgroundColor: "lightgreen",
    height: "100%",
    rowGap: 20,
  },
  tile: {
    width: "45%",
    aspectRatio: 0.75,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
    marginBottom: 10,
  },
  type: {
    fontSize: 14,
    fontWeight: "bold",
  },
  nickname: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  button: {
    position: "absolute",
    bottom: 100,
    left: 10,
    width: 120,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  loading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
