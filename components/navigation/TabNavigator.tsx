import { HomeScreen } from "../screens/HomeScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { AddPlantScreen } from "../screens/AddPlantScreen";
import { MyPlantsScreen } from "../screens/MyPlantsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

import { View } from "react-native";

import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { IdentifyPlantScreen } from "../screens/IdentifyPlantScreen";

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.navigationBar,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <AntDesign
                  name="home"
                  size={30}
                  color={focused ? "#00ff7f" : "white"}
                ></AntDesign>
              </View>
            );
          },
          tabBarIconStyle: styles.navigationIcon,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <AntDesign
                  name="calendar"
                  size={30}
                  color={focused ? "#00ff7f" : "white"}
                ></AntDesign>
              </View>
            );
          },
          tabBarIconStyle: styles.navigationIcon,
        }}
      />
      <Tab.Screen
        name="identify-plant"
        component={IdentifyPlantScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <AntDesign
                  name="pluscircle"
                  size={50}
                  color={focused ? "#00ff7f" : "white"}
                />
              </View>
            );
          },
          tabBarIconStyle: styles.navigationIcon,
        }}
      />
      <Tab.Screen
        name="My plants"
        component={MyPlantsScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <AntDesign
                  name="staro"
                  size={30}
                  color={focused ? "#00ff7f" : "white"}
                ></AntDesign>
              </View>
            );
          },
          tabBarIconStyle: styles.navigationIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <AntDesign
                  name="profile"
                  size={30}
                  color={focused ? "#00ff7f" : "white"}
                ></AntDesign>
              </View>
            );
          },
          tabBarIconStyle: styles.navigationIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    position: "absolute",
    bottom: 25,
    left: 10,
    right: 10,
    backgroundColor: "#293f44",
    borderRadius: 15,
    height: 60,
    paddingBottom: 0,
  },
  navigationIcon: {
    height: 50,
    width: 50,
  },
});
