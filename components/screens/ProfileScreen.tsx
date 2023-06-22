import { useContext, useEffect, useState } from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { useFonts } from 'expo-font'
import getUserDoc from '../utils/getUserDoc'
import { UserContext } from '../context/User'

export function ProfileScreen({ navigation }) {
	const [successfullLogOut, setSuccessfulLogout] = useState<boolean>(false)
	const [buttonPressed, setButtonPressed] = useState(false)

	const { userEmail } = useContext(UserContext)

	const [fontsLoaded] = useFonts({
		'BDO-Grotesk-Light': require('../../assets/BDOGrotesk-Light.ttf'),
		'BDO-Grotesk-Reg': require('../../assets/BDOGrotesk-Regular.ttf'),
		'BDO-Grotesk-Med': require('../../assets/BDOGrotesk-Medium.ttf'),
		'BDO-Grotesk-Bold': require('../../assets/BDOGrotesk-Bold.ttf')
	})

	if (!userEmail) {
		return <Text style={styles.signInMessage}>Please Sign In!</Text>
	} else {
		useEffect(() => {
			if (successfullLogOut) {
				setSuccessfulLogout(true)
			}
		}, [userEmail, successfullLogOut])

		const handleLogOut = () => {
			setSuccessfulLogout(true)
			navigation.navigate('Login Page')
		}

		if (!fontsLoaded) {
			return null
		}

		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 20 }}>
				<Text style={styles.accountInfo}>
					Account email:
					<Text style={styles.accountInfoValue}> {userEmail}</Text>
				</Text>
				<Pressable
					style={!buttonPressed ? styles.button : { ...styles.button, opacity: 0.7 }}
					onPress={handleLogOut}
					onPressIn={() => setButtonPressed(true)}
          onPressOut={() => setButtonPressed(false)}>
					<Text style={styles.buttonText}>Logout</Text>
				</Pressable>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	accountInfo: {
		fontFamily: 'BDO-Grotesk-Reg',
    fontSize: 18
	},
	accountInfoValue: {
		fontFamily: 'BDO-Grotesk-Light'
	},
	button: {
		backgroundColor: '#00A36C',
		paddingVertical: 9,
		paddingHorizontal: 18,
		borderRadius: 20
	},
	buttonText: {
		fontFamily: 'BDO-Grotesk-Med',
		fontSize: 18,
		color: '#ffffff'
	},
	signInMessage: {
		fontFamily: 'BDO-Grotesk-Reg',
		textAlign: 'center',
		fontSize: 28,
		justifyContent: 'center',
		top: '50%',
		fontWeight: 'bold'
	}
})
