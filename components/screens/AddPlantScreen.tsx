import { View, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native'
import { TabNavigator } from '../navigation/TabNavigator'

export function AddPlantScreen({ navigation }) {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<TouchableOpacity>
				<Pressable style={styles.button}>
					<Text style={styles.buttonText}>Add Plant Manually</Text>
				</Pressable>
				<Pressable
					style={styles.button}
					onPress={() => {
						navigation.navigate('Identify Plant')
					}}>
					<Text style={styles.buttonText}>Identify Your Plant</Text>
				</Pressable>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 20,
		backgroundColor: '#225b4c',
		padding: 40,
		marginVertical: 20
	},
	buttonText: {
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#00ff7f'
	}
})
