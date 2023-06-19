import { useContext, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Button } from 'react-native'
import signUp from '../utils/signUpData'
import signIn from '../utils/signInUser'
import { UserContext } from '../context/User'

export function LoginScreen({ navigation }) {
	const [emailSignUp, setEmailSignup] = useState<string>('')
	const [email, setEmailLogin] = useState<string>('')
	const [passwordSignUp, setPasswordSignUp] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [errorLogin, setErrorLogin] = useState<string>('')
	const [successfullSignUp, setSuccessfullSignUp] = useState<Boolean>(false)
	const [successfullSignIn, setSuccessfulSignIn] = useState<Boolean>(false)
	const [showSignUp, setShowSignup] = useState<Boolean>(false)

  const {setUserEmail} = useContext(UserContext)

	const handleSignup = () => {
		setError('')
		let location = {
			"latitude": 52.48,
			"longitude": -1.90}
		signUp(emailSignUp, passwordSignUp,location)
			.then(() => {
				setSuccessfullSignUp(true)
        setUserEmail(emailSignUp)
        navigation.navigate('App')
			})
			.catch((error) => {
				if (error) {
					setError(error.code)
				}
				setSuccessfullSignUp(false)
			})
	}

	const handleLogin = () => {
		setErrorLogin('')
		signIn(email, password)
			.then(() => {
				setSuccessfulSignIn(true)
        setUserEmail(email)
        navigation.navigate('App')
			})
			.catch((error) => {
				if (error) {
					setErrorLogin(error.code)
					setSuccessfulSignIn(false)
				}
			})
	}

	const toggleSignUp = () => {
		if (!showSignUp) setShowSignup(true)
		else setShowSignup(false)
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Happy Seeds</Text>
			<View style={styles.fields}>
				<View>
					<TextInput
						style={styles.input}
						placeholder='Email....'
						onChangeText={(text) => setEmailLogin(text)}
						value={email}
					/>
					<TextInput
						style={styles.input}
						placeholder='Password ..'
						onChangeText={(text) => setPassword(text)}
						value={password}
						secureTextEntry
					/>
					<TouchableOpacity style={styles.button} onPress={handleLogin}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
					{errorLogin ? <Text style={styles.error}>{errorLogin}</Text> : null}
					{successfullSignIn ? <Text style={styles.error}>login success</Text> : null}
				</View>

				<TouchableOpacity style={styles.button} onPress={toggleSignUp}>
					{!showSignUp ? (
						<Text style={styles.buttonText}>Show Sign Up </Text>
					) : (
						<Text style={styles.buttonText}>Hide Sign Up</Text>
					)}
				</TouchableOpacity>
				{showSignUp && (
					<View>
						<TextInput
							style={styles.input}
							placeholder='Email....'
							onChangeText={(text) => setEmailSignup(text)}
							value={emailSignUp}
						/>
						<TextInput
							style={styles.input}
							placeholder='Password ..'
							onChangeText={(text) => setPasswordSignUp(text)}
							value={passwordSignUp}
							secureTextEntry
						/>
						<TouchableOpacity style={styles.button} onPress={handleSignup}>
							<Text style={styles.buttonText}>Sign-up</Text>
						</TouchableOpacity>
						{error ? <Text style={styles.error}>{error}</Text> : null}
						{successfullSignUp ? <Text style={styles.error}>Signed up</Text> : null}
					</View>
				)}
			</View>
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#AAFFAA'
	},
	input: {
		width: '100%',
		height: 40,
		borderWidth: 1,
		borderColor: 'gray',
		marginBottom: 12,
		paddingHorizontal: 8
	},
	button: {
		backgroundColor: '#2196F3',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 4,
		marginBottom: 10
	},
	buttonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	error: {
		color: 'red',
		fontSize: 16,
		marginTop: 8
	},
	fields: {
		borderWidth: 2,
		margin: 10,
		padding: 10,
		width: 400,
		top: 200,
		borderRadius: 20,
		backgroundColor: 'white',
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 0.5,
		shadowRadius: 3.84,
		elevation: 10
	},
	header: {
		fontSize: 30,
		top: 300
	}
})

export default LoginScreen
