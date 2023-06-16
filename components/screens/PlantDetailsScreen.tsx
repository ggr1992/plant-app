import {
	Text,
	ScrollView,
	Button,
	View,
	SafeAreaView,
	StyleSheet,
	Image,
	ImageSourcePropType,
	Pressable
} from 'react-native'
import { useState, useEffect } from 'react'
import { capitalise } from '../utils/capitalise'
import Icon from 'react-native-vector-icons/AntDesign'
const plantData = require('../../data/development-data/data')

export function PlantDetailsScreen() {
	const [plantDetails, setPlantDetails] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const [displayCareGuide, setDisplayCareGuide] = useState(false)
	useEffect(() => {
		setPlantDetails(() => {
			const plant: object = plantData[5]
			plant['common_name'] = capitalise(plant['common_name'])
			plant['scientific_name'] = plant['scientific_name'].map((name) => capitalise(name))
			if (plant['other_name'].length === 0) {
				delete plant['other_name']
			} else {
				plant['other_name'] = plant['other_name'].map((name) => capitalise(name))
			}
			plant['watering'] = plant['watering'].toLowerCase()
			plant['sunlight'] = plant['sunlight'].map((string) => {
				return string.trim().toLowerCase()
			})
			plant['maintenance'] = plant['maintenance'].toLowerCase()
			plant['propagation'] = plant['propagation'].map((string) => {
				return string.trim().toLowerCase()
			})
			plant['soil'] = plant['soil'].map((string) => {
				return string.trim().toLowerCase()
			})
			return plant
		})
		setIsLoading(false)
	}, [])

	if (isLoading) {
		return (
			<View style={styles.container}>
				<Text>Loading</Text>
			</View>
		)
	}

	return (
		<View style={styles.page}>
			<SafeAreaView style={styles.containerWrapper}>
				<ScrollView contentContainerStyle={styles.container}>
					<Text style={styles.headerText}>{plantDetails['common_name']}</Text>
					<Text style={{ ...styles.headerText, fontWeight: 'bold' }}>{plantDetails['scientific_name']}</Text>
					{plantDetails['other_name'] && (
						<Text style={styles.subHeaderText}>Also known as {plantDetails['other_name'].join(', ')}</Text>
					)}
					<View style={styles.imageContainer}>
						<Image style={styles.image} source={{ uri: plantDetails['image_url'] } as ImageSourcePropType} />
					</View>
					<Text style={styles.bodyText}>
						<Text style={{ fontWeight: 'bold' }}>Family: </Text>
						{plantDetails['family']}
					</Text>
					<Text style={styles.bodyText}>
						<Text style={{ fontWeight: 'bold' }}>Origin: </Text>
						{plantDetails['origin'].join(', ')}
					</Text>
					<Text style={styles.bodyText}>
						<Text style={{ fontWeight: 'bold' }}>Type: </Text>
						{plantDetails['type']}
					</Text>
					<Text style={styles.bodyText}>
						<Text style={{ fontWeight: 'bold' }}>Dimension: </Text>
						{plantDetails['dimension']}
					</Text>
					<Text style={styles.bodyText}>
						<Text style={{ fontWeight: 'bold' }}>Indoor plant? </Text>
						{plantDetails['indoor'] ? 'Yes' : 'No'}
					</Text>
					<Text style={styles.descriptionText}>{plantDetails['plant_description']}</Text>
					<Pressable onPress={() => setDisplayCareGuide(!displayCareGuide)}>
						<View style={{ paddingLeft: 10, flexDirection: 'row', columnGap: 15, alignItems: 'center' }}>
							<View style={{ width: 30, height: 30 }}>
								<Icon style={displayCareGuide && styles.iconActive} name='down' size={30} color='black'></Icon>
							</View>
							<Text style={{ ...styles.subHeaderText, fontWeight: 'bold' }}>
								{displayCareGuide ? 'Hide care guide' : 'View care guide'}
							</Text>
						</View>
					</Pressable>
					{displayCareGuide && (
						<View style={{flexDirection: 'column', rowGap: 10}}>
							<View style={{ flexDirection: 'row', columnGap: 10, justifyContent: 'center', alignItems: 'center' }}>
								<Image style={styles.icon} source={require('../../assets/watering.png')} />
								<Text style={{ ...styles.bodyText, fontWeight: 'bold' }}>{plantDetails['watering']}</Text>
							</View>
							<Text style={styles.descriptionText}>{plantDetails['watering_description']}</Text>
							<View style={{ flexDirection: 'row', columnGap: 10, justifyContent: 'center', alignItems: 'center' }}>
								<Image style={styles.icon} source={require('../../assets/sunlight.png')} />
								<Text style={{ ...styles.bodyText, fontWeight: 'bold' }}>{plantDetails['sunlight'].join(', ')}</Text>
							</View>
							<Text style={styles.descriptionText}>{plantDetails['sunlight_description']}</Text>
							{plantDetails['pruning_description'] && (
								<>
									<View style={{ flexDirection: 'row', columnGap: 10, justifyContent: 'center', alignItems: 'center' }}>
										<Image style={styles.icon} source={require('../../assets/pruning.png')} />
										<Text style={{ ...styles.bodyText, fontWeight: 'bold' }}>
											{plantDetails['maintenance']} maintenance
										</Text>
									</View>
									<Text style={styles.descriptionText}>{plantDetails['pruning_description']}</Text>
								</>
							)}
							<View style={{ flexDirection: 'row', columnGap: 10, justifyContent: 'center', alignItems: 'center' }}>
								<Image style={styles.icon} source={require('../../assets/soil.png')} />
								<Text style={{ ...styles.bodyText, fontWeight: 'bold' }}>{plantDetails['soil'].join(', ')}</Text>
							</View>
							<View style={{ flexDirection: 'row', columnGap: 10, justifyContent: 'center', alignItems: 'center' }}>
								<Image style={styles.icon} source={require('../../assets/planting.png')} />
								<Text style={{ ...styles.bodyText, fontWeight: 'bold' }}>{plantDetails['propagation'].join(', ')}</Text>
							</View>
						</View>
					)}
				</ScrollView>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	page: {
		backgroundColor: '#728c69',
		height: '100%'
	},
	containerWrapper: {
		height: '89.5%'
	},
	container: {
		paddingTop: 5,
		paddingBottom: 10,
		marginHorizontal: 10,
		backgroundColor: '#ffffcd',
		rowGap: 8
	},
	imageContainer: {
		width: '100%',
		alignSelf: 'center'
	},
	image: {
		width: '100%',
		aspectRatio: 1,
		alignSelf: 'center',
		borderRadius: 15
	},
	headerText: {
		fontSize: 24,
		textAlign: 'center'
	},
	subHeaderText: {
		fontSize: 18,
		textAlign: 'center'
	},
	bodyText: {
		fontSize: 18,
		textAlign: 'left'
	},
	descriptionText: {
		fontSize: 16,
		textAlign: 'center'
	},
	iconActive: {
		transform: [{ rotate: '180deg' }]
	},
	icon: {
		width: 32,
		height: 32
	}
})
