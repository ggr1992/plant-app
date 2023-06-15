import { Text, ScrollView, View, SafeAreaView, StyleSheet, Image, ImageSourcePropType, Pressable } from 'react-native'
import { useState, useEffect } from 'react'
import { capitalise } from '../../utils/capitalise'
const plantData = require('../../data/development-data/data')

export function PlantDetailsScreen() {
	const [plantDetails, setPlantDetails] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		setPlantDetails(() => {
			const plant = plantData[5]
			plant['common_name'] = capitalise(plant['common_name'])
			plant['scientific_name'] = plant['scientific_name'].map((name) => capitalise(name))
			if (plant['other_name'].length === 0) {
				delete plant['other_name']
			} else {
				plant['other_name'] = plant['other_name'].map((name) => capitalise(name))
			}
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

	let keys = Object.keys(plantDetails)
	for (let i = 0; i < 10; i++) {
		keys.shift()
	}
	let strKeys = keys.join(' \n')

	return (
		<View style={styles.page}>
			<SafeAreaView style={styles.containerWrapper}>
				<ScrollView contentContainerStyle={styles.container}>
					<Text style={styles.headerText}>{plantDetails['common_name']}</Text>
					<Text style={{ ...styles.headerText, fontWeight: 'bold' }}>{plantDetails['scientific_name']}</Text>
					{plantDetails['other_name'] && (
						<Text style={styles.subHeaderText}>Also known as {plantDetails['other_name'].join(', ')}</Text>
					)}
					<Pressable><Text>Skip to care guide</Text></Pressable>
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
					<Text>{strKeys}</Text>

				</ScrollView>
				
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	page: {
		backgroundColor: 'white',
		height: '100%'
	},
	containerWrapper: {
		height: '89.5%'
	},
	container: {
		paddingTop: 5,
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
	}
})
