import { CalendarScreen } from "../screens/CalendarScreen";
import { AddPlantScreen } from "../screens/AddPlantScreen";
import { MyPlantsScreen } from "../screens/MyPlantsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { IdentifyPlantScreen } from "../screens/IdentifyPlantScreen";
import { PlantDetailsScreen } from "../screens/PlantDetailsScreen";
import { LoginScreen } from "../screens/LoginPage";
import { View } from "react-native";

import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { Entypo } from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LightSensorScreen } from "../screens/LightSensorScreen";

const Tab = createBottomTabNavigator();
const AddPlantStack = createNativeStackNavigator();
const MyPlantsStack = createNativeStackNavigator();
const LoginPageStack = createNativeStackNavigator();

export function LoginPageStackNavigator() {
  return (
    <LoginPageStack.Navigator initialRouteName="Login Page">
      <LoginPageStack.Screen
        name="Login Page"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <LoginPageStack.Screen
        name="App"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </LoginPageStack.Navigator>
  );
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="My Plants Stack"
      screenOptions={() => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.navigationBar,
      })}
    >
      <Tab.Screen
        name="My Plants Stack"
        component={MyPlantsStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Icon
                  name="staro"
                  size={30}
                  color={focused ? "#00ff7f" : "white"}
                ></Icon>
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
                <Icon
                  name="calendar"
                  size={30}
                  color={focused ? "#00ff7f" : "white"}
                ></Icon>
              </View>
            );
          },
          tabBarIconStyle: styles.navigationIcon,
        }}
      />
      <Tab.Screen
        name="Add Plant Stack"
        component={AddPlantStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Icon
                  name="pluscircleo"
                  size={45}
                  color={focused ? "#00ff7f" : "white"}
                />
              </View>
            );
          },
          tabBarIconStyle: styles.navigationIcon,
        }}
      />
       <Tab.Screen
        name="Light Sensor"
        component={LightSensorScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Entypo
                  name="light-up"
                  size={30}
                  color={focused ? "#00ff7f" : "white"}
                />
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
                <Icon
                  name="profile"
                  size={30}
                  color={focused ? "#00ff7f" : "white"}
                ></Icon>
              </View>
            );
          },
          tabBarIconStyle: styles.navigationIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export function AddPlantStackNavigator() {
  return (
    <AddPlantStack.Navigator initialRouteName="Add Plant">
      <AddPlantStack.Screen
        name="App"
        component={TabNavigator}
        options={{ headerShown: false }}
      ></AddPlantStack.Screen>
      <AddPlantStack.Screen
        name="Add Plant"
        component={AddPlantScreen}
        options={{ headerShown: false }}
      ></AddPlantStack.Screen>
      <AddPlantStack.Screen
        name="Identify Plant"
        component={IdentifyPlantScreen}
        options={{ headerShown: false }}
      ></AddPlantStack.Screen>
      <AddPlantStack.Screen
        name="Light Sensor"
        component={LightSensorScreen}
        options={{ headerShown: false }}
      ></AddPlantStack.Screen>
    </AddPlantStack.Navigator>
  );
}

export function MyPlantsStackNavigator() {
  return (
    <MyPlantsStack.Navigator initialRouteName="My Plants">
      <MyPlantsStack.Screen
        name="My Plants"
        component={MyPlantsScreen}
        options={{ headerShown: false }}
      />
      <MyPlantsStack.Screen
        name="Plant Details"
        component={PlantDetailsScreen}
        options={{ headerShown: false }}
      />
    </MyPlantsStack.Navigator>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    position: "absolute",
    bottom: "3%",
    left: 10,
    right: 10,
    backgroundColor: "#293f44",
    borderColor: "black",
    borderRadius: 15,
    height: "7%",
    paddingBottom: 0,
  },
  navigationIcon: {
    height: 50,
    width: 50,
  },
});
