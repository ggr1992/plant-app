import { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, Pressable, SafeAreaView, StyleSheet } from 'react-native'
// import data, { filter } from '../../data/test-data/data'
const data = require('../../data/development-data/data')

export function AddPlantScreen() {
	const plantData = data.map((plant) => {
		return {
			common_name: plant.common_name,
			scientific_name: plant.scientific_name,
			other_name: plant.other_name
		}
	})
	const [plantList, setPlantList] = useState(plantData)
	const [searchTerm, setSearchTerm] = useState('')
	const [displaySuggestions, setDisplaySuggestions] = useState(false)

	const plantNamesRef = {}
	plantList.forEach((plant, index) => {
		plantNamesRef[plant.common_name] = index
	})

	const namesArray = Object.keys(plantNamesRef)

	const filteredNames = []

	namesArray.forEach((name) => {
		if (filteredNames.length === 0) {
			filteredNames.push(name)
		} else {
			if (plantNamesRef[filteredNames.at(-1)] !== plantNamesRef[name]) {
				filteredNames.push(name)
			}
		}
	})

	let autocompleteList = filteredNames.filter((name) => {
		return name.toLowerCase().includes(searchTerm.toLowerCase())
	})

	if (autocompleteList.length !== 0) {
		autocompleteList = autocompleteList.map((name: string) => {
			const index = plantNamesRef[name]
			let nameArr: string[] = name.split(' ')
			nameArr = nameArr.map((word) => {
				return word.charAt(0).toUpperCase() + word.slice(1)
			})
			name = nameArr.join(' ')
			return { name: name, scientific_name: plantList[index]['scientific_name'], id: plantNamesRef[name] }
		})
	}

	useEffect(() => {
		if (searchTerm.length > 2) {
			setDisplaySuggestions(true)
		} else {
			setDisplaySuggestions(false)
		}
	}, [searchTerm])

	return (
		<SafeAreaView
			style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', borderColor: 'red', borderWidth: 10 }}>
			<View style={styles.container}>
				<TextInput
					placeholder='Search for a plant...'
					value={searchTerm}
					onChangeText={setSearchTerm}
					style={styles.searchBox}
				/>
				{displaySuggestions && (
					<FlatList
						style={styles.suggestionBox}
						data={autocompleteList}
						renderItem={({ item }) => {
							return (
								<Pressable
									onPress={() => {
										setSearchTerm(item)
									}}>
									<Text style={styles.suggestionText}>
										{item.name} <Text style={{ fontWeight: 'bold' }}>{item.scientific_name}</Text>
									</Text>
								</Pressable>
							)
						}}
					/>
				)}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
		borderColor: 'red',
		borderWidth: 5,
		width: '90%',
		justifySelf: 'flex-start'
	},
	searchBox: {
		padding: 10,
		borderColor: 'black',
		borderRadius: 15,
		borderWidth: 2,
		fontSize: 18
	},
	suggestionBox: {
		marginTop: 5,
		borderColor: 'blue',
		borderRadius: 15,
		borderWidth: 2
	},
	suggestionText: {
		fontSize: 18
	}
})
