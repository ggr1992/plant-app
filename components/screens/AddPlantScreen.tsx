import { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, Pressable, SafeAreaView, StyleSheet, Button, Image, ImageSourcePropType } from 'react-native'
import { useFonts } from 'expo-font'
import addPlantToUser from '../utils/addPlantToUser'
import { capitalise } from '../utils/capitalise'
import { queryBySearchTerm, querySinglePlantByScientificName } from '../utils/api'

export function AddPlantScreen({ navigation, route }) {
	const [searchTerm, setSearchTerm] = useState('')
	const [nickname, setNickname] = useState('')
	const [selectedPlant, setSelectedPlant] = useState(null)
	const [filteredPlants, setFilteredPlants] = useState([])
	const [selectedPlantWithId, setSelectedPlantWithId] = useState(null)
	const [displayAutocomplete, setDisplayAutocomplete] = useState(false)
	const [autocompleteHeight, setAutocompleteHeight] = useState(0)

	const [fontsLoaded] = useFonts({
		'BDO-Grotesk-Med': require('../../assets/BDOGrotesk-Medium.ttf'),
		'BDO-Grotesk-Bold': require('../../assets/BDOGrotesk-Bold.ttf')
	})

	useEffect(() => {
		if (searchTerm.length < 3) {
			setDisplayAutocomplete(false)
		} else {
			if (selectedPlant === null) {
				queryBySearchTerm(searchTerm).then((results) => {
					setFilteredPlants(results)
				})
			}
			if (searchTerm !== selectedPlant?.scientific_name[0]) {
				setSelectedPlant(null)
			}
		}
	}, [searchTerm])

	useEffect(() => {
		if (filteredPlants.length > 0) {
			setDisplayAutocomplete(true)
			setAutocompleteHeight(170 * filteredPlants.length)
		}
	}, [filteredPlants])

	useEffect(() => {
		if (selectedPlant !== null) {
			querySinglePlantByScientificName(selectedPlant.scientific_name[0]).then((plant) => {
				setSelectedPlantWithId({ ...selectedPlant, id: plant.id })
			})
		}
	}, [selectedPlant])

	useEffect(() => {
		if (route?.params?.plant) {
			setSearchTerm(route.params.plant.scientific_name[0])
			setSelectedPlant(route.params.plant)
		}
	}, [route])

	const addPlant = () => {
		// TODO: get user based on context
		const user = 'test_user'
		const plantId = selectedPlantWithId.id
		addPlantToUser(user, plantId, nickname)
			.then(() => {
				setNickname('')
				setSelectedPlant(null)
				setSearchTerm('')
				navigation.navigate('My Plants Stack')
			})
			.catch(() => {
				console.log('Could not add plant...')
			})
	}

	const identifyPlant = () => {
		setSearchTerm('')
		navigation.navigate('Identify Plant')
	}

	if (!fontsLoaded) {
		return null
	}

	return (
		<View style={styles.page}>
			<SafeAreaView style={styles.contentWrapper}>
				<View style={styles.content}>
					<View style={styles.container}>
						<TextInput
							placeholder='Give it a nickname...'
							value={nickname}
							onChangeText={setNickname}
							style={styles.nicknameInput}></TextInput>
						<TextInput
							placeholder='Search for a plant...'
							value={searchTerm}
							onChangeText={setSearchTerm}
							style={styles.searchBox}
						/>
					</View>

					{displayAutocomplete && (
						<FlatList
							style={{ ...styles.suggestionBox, height: autocompleteHeight, flexGrow: 0 }}
							data={filteredPlants}
							renderItem={({ item }) => {
								return (
									<Pressable
										key={item.scientific_name[0]}
										onPress={() => {
											setSelectedPlant(item)
											setSearchTerm(item.scientific_name[0])
											setFilteredPlants([])
										}}>
										<View style={styles.listItem}>
											<Image style={styles.listImage} source={{ uri: item.image_url } as ImageSourcePropType} />
											<View style={{ flex: 1 }}>
												<Text style={styles.suggestionText}>{capitalise(item.common_name)} </Text>
												<Text style={styles.suggestionTextBold}>{item.scientific_name}</Text>
											</View>
										</View>
									</Pressable>
								)
							}}
						/>
					)}

					{selectedPlant && (
						<Image source={{ uri: selectedPlant.image_url }} style={{ marginTop: 20, width: '80%', aspectRatio: 1 }} />
					)}
					{!selectedPlant && (
						<Text style={{ fontFamily: 'BDO-Grotesk-Med', fontSize: 16 }}>
							Select a plant to continue...
						</Text>
					)}
					{selectedPlant && (
						<Pressable onPress={addPlant}>
							<View style={styles.button}>
								<Text style={{...styles.buttonText, color: 'green'}}>Add plant</Text>
							</View>
						</Pressable>
					)}
					<Pressable
						onPress={() => {
							setSearchTerm('')
							setSelectedPlant(null)
							setDisplayAutocomplete(false)
						}}>
						<View style={styles.button}>
							<Text style={{...styles.buttonText, color: 'red'}}>Reset</Text>
						</View>
					</Pressable>
					<Pressable onPress={identifyPlant}>
						<View style={styles.button}>
							<Text style={{...styles.buttonText, color: 'blue'}}>Identify with camera</Text>
						</View>
					</Pressable>
				</View>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	page: {
		backgroundColor: 'black',
		height: '100%'
	},
	contentWrapper: {
		height: '89.5%',
	},
	content: {
		rowGap: 10,
		backgroundColor: 'white',
		borderColor: 'red',
		marginHorizontal: 10,
		borderRadius: 15,
		height: '100%',
		alignItems: 'center',
		paddingTop: 20
	},
	container: {
		width: '95%',
		marginHorizontal: 10,
		backgroundColor: 'whitesmoke'
	},
	searchBox: {
		fontFamily: 'BDO-Grotesk-Med',
		padding: 10,
		borderColor: 'black',
		borderRadius: 15,
		borderWidth: 2,
		fontSize: 16
	},
	suggestionBox: {
		width: '95%',
		paddingRight: 5,
		marginVertical: 5,
		borderColor: 'red',
		borderRadius: 5,
		borderWidth: 2,
		backgroundColor: 'white'
	},
	suggestionText: {
		fontFamily: 'BDO-Grotesk-Med',
		fontSize: 16,
		justifyContent: 'center'
	},
	suggestionTextBold: {
		fontFamily: 'BDO-Grotesk-Bold',
		fontSize: 16
	},
	nicknameInput: {
		fontFamily: 'BDO-Grotesk-Med',
		padding: 10,
		borderColor: 'black',
		borderRadius: 15,
		borderWidth: 2,
		fontSize: 16,
		marginBottom: 5
	},
	camera: {
		height: 200,
		width: '100%',
		marginTop: 10
	},
	capturedImage: {
		width: 250,
		height: 250
	},
	button: {
		padding: 10,
		borderWidth: 3,
		borderRadius: 10,
		justifyContent: 'center',
	},
	buttonText: {
		fontFamily: 'BDO-Grotesk-Med',
		fontSize: 16
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	listImage: {
		flex: 1,
		height: 150,
		aspectRatio: 'auto',
		borderWidth: 2,
		borderColor: '#d35647',
		margin: 8
	}
})
