import { Text, View, SafeAreaView, StyleSheet, Image, ImageSourcePropType } from 'react-native'
import { useState, useEffect } from 'react'
import { capitalise } from '../../utils/capitalise'
const plantData = require('../../data/development-data/data')

export function PlantDetailsScreen() {
	const [plantDetails, setPlantDetails] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	useEffect(() => {
		setIsLoading(true)
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
		return <View style={styles.container}>Loading...</View>
	}

	return (
		<SafeAreaView>
			<View style={styles.container}>
				<Text style={styles.headerText}>{plantDetails['common_name']}</Text>
				<Text style={{ ...styles.headerText, fontWeight: 'bold' }}>{plantDetails['scientific_name']}</Text>
				{plantDetails['other_name'] && (
					<Text style={styles.text}>Also known as {plantDetails['other_name'].join(', ')}</Text>
				)}
				<Image
					style={styles.image}
					source={{uri: plantDetails['image_url']} as ImageSourcePropType}
				/>
			</View>
			{/* <Text>Watering Frequency: {myPlant.watering}</Text>
			<Text>Sunlight: {myPlant.sunlight}</Text>
			<Text>Maintenance: {myPlant.maintenance}</Text>
      */}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 'auto',
		padding: '5%',
		height: '100%',
		backgroundColor: '#ffffcd',
		rowGap: 10
	},
	image: {
    width: '99%',
    height: undefined,
		aspectRatio: 1,
		resizeMode: 'contain',
    alignSelf: 'center',
	},
	headerText: {
		fontSize: 24,
		textAlign: 'center'
	},
	text: {
		fontSize: 18,
		textAlign: 'center'
	}
})
