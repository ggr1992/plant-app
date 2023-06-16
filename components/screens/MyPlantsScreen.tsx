import { View, Text, Pressable } from 'react-native'

export function MyPlantsScreen({ navigation }) {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>My Plants screen</Text>
			<Pressable onPress={() => navigation.navigate('Plant Details')}>
				<View style={{marginTop: 20, width: 220, height: 20, backgroundColor: 'green'}}>
					<Text style={{color: 'white', textAlign: 'center'}}>Press here to see plant details</Text>
				</View>
			</Pressable>
		</View>
	)
}