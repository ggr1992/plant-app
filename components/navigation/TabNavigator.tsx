import { HomeScreen } from '../screens/HomeScreen'
import { CalendarScreen } from '../screens/CalendarScreen'
import { AddPlantScreen } from '../screens/AddPlantScreen'
import { MyPlantsScreen } from '../screens/MyPlantsScreen'
import { ProfileScreen } from '../screens/ProfileScreen'

import { View } from 'react-native'

import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PlantDetailsScreen } from '../screens/PlantDetailsScreen'

const Tab = createBottomTabNavigator()

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
				name='My plants'
				component={PlantDetailsScreen}
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
