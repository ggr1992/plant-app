import { useContext } from 'react'
import { View, Text } from 'react-native'
import { UserContext } from '../context/User'
// import { useState, useEffect } from 'react'
// import Location from 'expo-location'

export function HomeScreen() {
	const { userEmail } = useContext(UserContext)
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Home screen</Text>
			<Text style={{ fontWeight: 'bold' }}>{userEmail}</Text>
		</View>
	)
}
