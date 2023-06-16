import { HomeScreen } from '../screens/HomeScreen'
import { CalendarScreen } from '../screens/CalendarScreen'
import { AddPlantScreen } from '../screens/AddPlantScreen'
import { MyPlantsScreen } from '../screens/MyPlantsScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { PlantDetailsScreen } from '../screens/PlantDetailsScreen'

import { View } from 'react-native'

import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Tab = createBottomTabNavigator()
const MyPlantsStack = createNativeStackNavigator()

export function TabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
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
								<Icon name='home' size={30} color={focused ? '#00ff7f' : 'white'}></Icon>
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
								<Icon name='calendar' size={30} color={focused ? '#00ff7f' : 'white'}></Icon>
							</View>
						)
					},
					tabBarIconStyle: styles.navigationIcon
				}}
			/>
			<Tab.Screen
				name='Add plant'
				component={AddPlantScreen}
				options={{
					tabBarIcon: ({ focused }) => {
						return (
							<View>
								<Icon name='pluscircle' size={45} color={focused ? '#00ff7f' : 'white'} />
							</View>
						)
					},
					tabBarIconStyle: styles.navigationIcon
				}}
			/>
			<Tab.Screen
				name='My Plants Stack'
				component={MyPlantsStackNavigator}
				options={{
					tabBarIcon: ({ focused }) => {
						return (
							<View>
								<Icon name='staro' size={30} color={focused ? '#00ff7f' : 'white'}></Icon>
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
								<Icon name='profile' size={30} color={focused ? '#00ff7f' : 'white'}></Icon>
							</View>
						)
					},
					tabBarIconStyle: styles.navigationIcon
				}}
			/>
		</Tab.Navigator>
	)
}

export function MyPlantsStackNavigator() {
	return (
		<MyPlantsStack.Navigator initialRouteName='My Plants'>
			<MyPlantsStack.Screen name='My Plants' component={MyPlantsScreen} options={{ headerShown: false }} />
			<MyPlantsStack.Screen name='Plant Details' component={PlantDetailsScreen} options={{ headerShown: false }} />
		</MyPlantsStack.Navigator>
	)
}

const styles = StyleSheet.create({
	navigationBar: {
		position: 'absolute',
		bottom: '3%',
		left: 10,
		right: 10,
		backgroundColor: '#293f44',
		borderColor: 'black',
		borderRadius: 15,
		height: '7%',
		paddingBottom: 0
	},
	navigationIcon: {
		height: 50,
		width: 50
	}
})
