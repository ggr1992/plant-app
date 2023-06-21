import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { LoginPageStackNavigator } from './components/navigation/Navigation'
import { UserProvider } from './components/context/User'

export default function App() {
	return (
		<NavigationContainer>
			<UserProvider>
				<StatusBar style='dark' />
				<LoginPageStackNavigator />
			</UserProvider>
		</NavigationContainer>
	)
}