import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { LoginPageStackNavigator } from './components/navigation/Navigation'
import LoginScreen from './components/screens/LoginPage'


export default function App() {
	return (
		<NavigationContainer>
      <LoginPageStackNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
