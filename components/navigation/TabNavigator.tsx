import { HomeScreen } from '../screens/HomeScreen'
import { CalendarScreen } from '../screens/CalendarScreen'
import { AddPlantScreen } from '../screens/AddPlantScreen'
import { MyPlantsScreen } from '../screens/MyPlantsScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { IdentifyPlantScreen } from '../screens/IdentifyPlantScreen'

import { View } from 'react-native'

import { StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Tab = createBottomTabNavigator()
const AddPlantStack = createNativeStackNavigator()

export function TabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={() => ({
				headerShown: false,
				tabBarShowLabel: false,
				tabBarStyle: styles.navigationBar
			})}>
			<Tab.Screen
				name='Home'
				component={HomeScreen}
				options={{
					tabBarIcon: ({ focused }) => {
						return (
							<View>
								<AntDesign name='home' size={30} color={focused ? '#00ff7f' : 'white'}></AntDesign>
							</View>
						)
					},
					tabBarIconStyle: styles.navigationIcon
				}}
			/>
			<Tab.Screen
				name='Calendar'
				component={CalendarScreen}
				options={{
					tabBarIcon: ({ focused }) => {
						return (
							<View>
								<AntDesign name='calendar' size={30} color={focused ? '#00ff7f' : 'white'}></AntDesign>
							</View>
						)
					},
					tabBarIconStyle: styles.navigationIcon
				}}
			/>
			<Tab.Screen
				name='Add Plant Stack'
				component={AddPlantStackNavigator}
				options={{
					tabBarIcon: ({ focused }) => {
						return (
							<View>
								<AntDesign name='pluscircle' size={50} color={focused ? '#00ff7f' : 'white'} />
							</View>
						)
					},
					tabBarIconStyle: styles.navigationIcon
				}}
			/>
			<Tab.Screen
				name='My plants'
				component={MyPlantsScreen}
				options={{
					tabBarIcon: ({ focused }) => {
						return (
							<View>
								<AntDesign name='staro' size={30} color={focused ? '#00ff7f' : 'white'}></AntDesign>
							</View>
						)
					},
					tabBarIconStyle: styles.navigationIcon
				}}
			/>
			<Tab.Screen
				name='Profile'
				component={ProfileScreen}
				options={{
					tabBarIcon: ({ focused }) => {
						return (
							<View>
								<AntDesign name='profile' size={30} color={focused ? '#00ff7f' : 'white'}></AntDesign>
							</View>
						)
					},
					tabBarIconStyle: styles.navigationIcon
				}}
			/>
		</Tab.Navigator>
	)
}

export function AddPlantStackNavigator() {
	return (
		<AddPlantStack.Navigator initialRouteName='Add Plant'>
			<AddPlantStack.Screen
				name='Add Plant'
				component={AddPlantScreen}
				options={{ headerShown: false }}></AddPlantStack.Screen>
			<AddPlantStack.Screen
				name='Identify Plant'
				component={IdentifyPlantScreen}
				options={{ headerShown: false }}></AddPlantStack.Screen>
		</AddPlantStack.Navigator>
	)
}

const styles = StyleSheet.create({
	navigationBar: {
		position: 'absolute',
		bottom: 25,
		left: 10,
		right: 10,
		backgroundColor: '#293f44',
		borderRadius: 15,
		height: 60,
		paddingBottom: 0
	},
	navigationIcon: {
		height: 50,
		width: 50
	}
})
