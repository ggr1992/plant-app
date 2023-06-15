import { View, Text } from 'react-native'
import { SignUpFuntion } from '../utils/signUpData'


export function HomeScreen() {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>			
			<Text>Home screen</Text>
			<SignUpFuntion/>
		</View>
	)
}
