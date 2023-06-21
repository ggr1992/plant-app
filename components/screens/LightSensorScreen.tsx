import { useState, useEffect } from 'react'
import { Text, StyleSheet, TouchableOpacity, View, Image, Platform } from 'react-native'
import { useFonts } from 'expo-font'
import { LightSensor } from 'expo-sensors'

const conditionMap = {
	500: {
		image: require('../../assets/light-deep-shade.png'),
		name: 'Deep Shade',
		description: 'Low light intensity. Not appropriate for most plants.'
	},
	1000: {
		image: require('../../assets/light-full-shade.png'),
		name: 'Shade',
		description:
			'Low light intensity but bright enough to read. It resembles natural light of an ordinary room. This light intensity is appropriate for shade-loving plants.'
	},
	2000: {
		image: require('../../assets/light-part-shade.png'),
		name: 'Indirect Sunlight',
		description:
			'Bright but indirect sunlight. This may produce a defined shadow. Appropriate for plants that require indirect sunlight.'
	},
	4000: {
		image: require('../../assets/light-half-sun.png'),
		name: 'Bright Light',
		description:
			'This light intensity is about 40% of midday sun as well as direct light coming through windows. Ideal for plants that require good and consistent light intensity.'
	},
	5000: {
		image: require('../../assets/light-half-sun.png'),
		name: 'Strong Direct Light',
		description:
			'This light intensity is about 50% of midday sun. This is strong direct sunlight in a bright room. Appropriate for plants that require a lot of strong light.'
	},
	10000: {
		image: require('../../assets/light-full-sun.png'),
		name: 'Strong Indoor Light',
		description: 'Very bright indoor light but still not as strong as sunlight outdoors.'
	},
	25000: {
		image: require('../../assets/light-full-sun.png'),
		name: 'Full Daylight',
		description:
			"Full daylight (not direct sun). Even the brightest rooms rarely, if ever, approach this level of sunlight. It's possible to burn plants placed too close to windows because the window glass can act like a magnifying glass."
	},
	999999: {
		image: require('../../assets/light-full-sun.png'),
		name: 'Full Sun',
		description: 'High-light/full-sun intensity. Suitable for outdoor plants requiring a lot of light.'
	}
}

export const LightSensorScreen = () => {
	const [{ illuminance }, setData] = useState({ illuminance: 0 })
	const [isActive, setIsActive] = useState(false)
	const [selectedCondition, setSelectedCondition] = useState(null)

	const [fontsLoaded] = useFonts({
		'BDO-Grotesk-Light': require('../../assets/BDOGrotesk-Light.ttf'),
		'BDO-Grotesk-Reg': require('../../assets/BDOGrotesk-Regular.ttf'),
		'BDO-Grotesk-Med': require('../../assets/BDOGrotesk-Medium.ttf'),
		'BDO-Grotesk-Bold': require('../../assets/BDOGrotesk-Bold.ttf')
	})

	useEffect(() => {
		_toggle()

		return () => {
			_unsubscribe()
		}
	}, [])

	const _toggle = () => {
		if (this._subscription) {
			setIsActive(true)
			_unsubscribe()
		} else {
			setIsActive(false)
			_subscribe()
		}
	}

	const _subscribe = () => {
		this._subscription = LightSensor.addListener(setData)
	}

	const _unsubscribe = () => {
		this._subscription && this._subscription.remove()
		this._subscription = null
	}

	useEffect(() => {
		const values = Object.keys(conditionMap)
		const current = values.find((value) => +value >= illuminance)
		const mappedCondition = conditionMap[current]

		if (!selectedCondition || selectedCondition.name !== mappedCondition.name) {
			setSelectedCondition(mappedCondition)
		}
	}, [illuminance])

	if (!fontsLoaded) {
		return null
	}

	return (
		<>
			<Image source={require('../../assets/bg-leaf.png')} style={styles.headerBackground} />
			<View style={styles.container}>
				{Platform.OS !== 'android' && (
					<>
						<Image source={require('../../assets/light-part-shade.png')} style={styles.placeholderIcon} />
						<Text style={styles.placeholderText}>
							Sorry, this feature is currently only available for Android devices.
						</Text>
					</>
				)}
				{Platform.OS === 'android' && (
					<View style={styles.sensor}>
						<Text style={styles.header}>Light Sensor</Text>
						<Text style={styles.subheader}>Check the amount of light by moving your phone to different areas!</Text>
						{selectedCondition !== null && <Image source={selectedCondition.image} style={styles.luxReadingImage} />}
						<Text style={styles.luxReading}>{illuminance} lux</Text>
						<Text style={styles.conditionName}>{selectedCondition ? selectedCondition.name : 'Scanning...'}</Text>
						<Text style={styles.conditionDescription}>{selectedCondition?.description ?? 'Loading...'}</Text>
						<View style={styles.buttonContainer}>
							<TouchableOpacity onPress={_toggle} style={isActive ? styles.buttonActive : styles.buttonInactive}>
								<Text style={styles.buttonText}>{isActive ? 'Resume ' : 'Pause '}scanning</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}

				<Image source={require('../../assets/bg-leaf2.png')} style={styles.footerBackground} />
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		marginTop: 40,
		padding: 20
	},
	buttonContainer: {
		marginTop: 15
	},
	buttonActive: {
		alignSelf: 'center',
		backgroundColor: '#b0112b',
		padding: 14,
		borderRadius: 40,
		color: '#fff'
	},
	buttonInactive: {
		alignSelf: 'center',
		backgroundColor: '#009172',
		padding: 14,
		borderRadius: 40,
		color: '#fff'
	},
	sensor: {
		marginTop: 45,
		paddingHorizontal: 10
	},
	footerBackground: {
		width: 400,
		zIndex: 1,
		resizeMode: 'contain',
		transform: [{ scaleX: -1 }, { scaleY: 1 }],
		position: 'absolute',
		bottom: -440,
		left: -60
	},
	headerBackground: {
		height: 300,
		zIndex: 1,
		resizeMode: 'contain',
		transform: [{ scaleX: -1 }, { scaleY: -1 }],
		position: 'absolute',
		top: -160,
		right: -150
	},
	placeholderIcon: {
		marginTop: 30,
		alignSelf: 'center',
		width: 200,
		aspectRatio: 1,
		opacity: 0.6
	},
	placeholderText: {
		marginTop: 10,
		textAlign: 'center',
		fontFamily: 'BDO-Grotesk-Light',
		fontSize: 20
	},
	header: {
		fontFamily: 'BDO-Grotesk-Med',
		fontSize: 36,
		textAlign: 'center',
		marginBottom: 10,
		color: '#009172'
	},
	subheader: {
		fontFamily: 'BDO-Grotesk-Reg',
		alignSelf: 'center',
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 16
	},
	luxReadingImage: {
		width: 150,
		aspectRatio: 1,
		alignSelf: 'center',
		opacity: 0.6
	},
	luxReading: {
		fontFamily: 'BDO-Grotesk-Reg',
		fontSize: 24,
		alignSelf: 'center'
	},
	conditionName: {
		fontFamily: 'BDO-Grotesk-Reg',
		textAlign: 'center',
		fontSize: 24,
		marginTop: 20,
		marginBottom: 10,
		color: '#e59700',
		fontWeight: 'bold'
	},
	conditionDescription: {
		textAlign: 'center',
		fontFamily: 'BDO-Grotesk-Light',
		fontSize: 16,
		height: 60
	},
	buttonText: {
		fontFamily: 'BDO-Grotesk-Reg',
		color: 'white'
	}
})
