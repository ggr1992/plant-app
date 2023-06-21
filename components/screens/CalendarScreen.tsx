import { FC, useState, useEffect, useContext } from 'react'
import { View, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, Button, Pressable } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { useFonts } from 'expo-font'
import { db } from '../../Firebase_Config/firebaseConfig'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import removeTask from '../utils/removeTaskFromUser'
import getUserDoc from '../utils/getUserDoc'
import addTaskToUser from '../utils/addTaskToUser'
import dayjs from 'dayjs'
import { UserContext } from '../context/User'
dayjs().format()

import Icon from 'react-native-vector-icons/AntDesign'

export const CalendarScreen: FC = () => {
	const { userEmail } = useContext(UserContext)
	const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({})
	const [selectedDate, setSelectedDate] = useState<string>('')
	const [selectedTasks, setSelectedTasks] = useState<string[]>([])
	const [nickNames, setNickNames] = useState<string[]>([])
	const [selectedNickname, setSelectedNickname] = useState(null)
	const [wateringDays, setWateringDays] = useState<number>(0)
	const [repeatedDays, setRepeatedDays] = useState<number>(0)

	const [savedPlantsVisible, setSavedPlantsVisible] = useState(false)
	const [addTasksVisible, setAddTasksVisible] = useState(false)

	const [fontsLoaded] = useFonts({
		'BDO-Grotesk-Light': require('../../assets/BDOGrotesk-Light.ttf'),
		'BDO-Grotesk-Reg': require('../../assets/BDOGrotesk-Regular.ttf'),
		'BDO-Grotesk-Med': require('../../assets/BDOGrotesk-Medium.ttf'),
		'BDO-Grotesk-Bold': require('../../assets/BDOGrotesk-Bold.ttf')
	})

	let alteredDate = dayjs(selectedDate).add(wateringDays, 'day').format()
	const slicedDate = alteredDate.slice(0, 10)

	useEffect(() => {
		getUserDoc(userEmail).then((result: object) => {
			setNickNames(Object.keys(result))
		})
	}, [])

	function addATask() {
		// if repeat counter = sliced date every time this happens
		if (!selectedNickname) {
			return
		}
		let counter = slicedDate
		const startDate = dayjs(selectedDate).format().slice(0, 10)
		let water = `Water ${selectedNickname}`
		addTaskToUser(startDate, water, selectedNickname)
		setMarkedDates({ ...markedDates, [counter]: { marked: true } })
		for (let i = 1; i < repeatedDays; i++) {
			let markedDatesObject = { ...markedDates } // Hasn't been tested if it doesn't work spread marked dated in line 122
			let water = `Water ${selectedNickname}`
			addTaskToUser(counter, water, selectedNickname)
			setMarkedDates({ markedDatesObject, [counter]: { marked: true } })
			counter = dayjs(counter).add(wateringDays, 'day').format().slice(0, 10)
		}
	}

	//start of nested function component

	interface DropdownProps {
		label: string
	}

	function Dropdown({ label }: DropdownProps) {
		const togglePlantDropDown = () => {
			setSavedPlantsVisible(!savedPlantsVisible)
		}

		const toggleTasksDropDown = () => {
			setAddTasksVisible(!addTasksVisible)
		}

		const handleDropdownSelect = (nickNames) => {
			setSelectedNickname(nickNames)
			setSelectedTasks([])
		}

		if (label === 'plant') {
			return (
				<Pressable onPress={togglePlantDropDown}>
					<View style={styles.filterDropdown}>
						<Text style={styles.buttonText}>{selectedNickname || 'Select your plant'}</Text>
						<Icon size={30} name='down' />
					</View>
					{savedPlantsVisible && (
						<View>
							{nickNames.map((nickName) => (
								<Pressable
									style={styles.filterDropdownOptions}
									key={nickName}
									onPress={() => handleDropdownSelect(nickName)}>
									<Text style={styles.dropdownText}>{nickName}</Text>
								</Pressable>
							))}
						</View>
					)}
				</Pressable>
			)
		} else if (label === 'schedule') {
			return (
				<>
					<TouchableOpacity style={styles.addTaskButton} onPress={toggleTasksDropDown}>
						<Text>
							Add a schedule for {selectedNickname} starting from {selectedDate}.
						</Text>
					</TouchableOpacity>
					{addTasksVisible && (
						<View>
							<Text>How often do you want to water {selectedNickname} :</Text>
							<TextInput
								placeholder='enter days here'
								keyboardType='number-pad'
								value={String(wateringDays)}
								onChangeText={(text) => setWateringDays(parseInt(text))}></TextInput>
							<TextInput
								placeholder='How many times'
								keyboardType='number-pad'
								value={String(repeatedDays)}
								onChangeText={(text) => setRepeatedDays(parseInt(text))}></TextInput>
							<Text>Days</Text>
							<TouchableOpacity style={styles.addTaskButton} onPress={addATask}>
								<Text style={styles.addTaskText}>Confirm</Text>
							</TouchableOpacity>
						</View>
					)}
				</>
			)
		}
	}

	// end of nested function component

	useEffect(() => {
		// Fetch the marked dates from Firestore
		const fetchMarkedDates = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, 'Users', userEmail, 'Schedule'))
				const markedDatesData: { [date: string]: any } = {}
				querySnapshot.forEach((doc) => {
					const date = doc.id
					let markedData
					if (doc.data()[selectedNickname]) {
						markedData = doc.data()[selectedNickname]
					}
					if (markedData) {
						if (markedData.task.length > 0) {
							markedDatesData[date] = {
								marked: true,
								selectedColor: 'blue'
								//dotColor: markedData.nickName.dotColor, // Assuming dotColor field exists in the database
								//  task: markedData.nickName.task, // Assuming task field exists in the database
							}
						}
					}
				})
				setMarkedDates(markedDatesData)
			} catch (error) {
				console.error('Error fetching marked dates:', error)
			}
		}
		fetchMarkedDates()
	}, [selectedNickname, selectedTasks])

	const handleDayPress = async (day) => {
		try {
			const selectedDate = day.dateString
			const docRef = doc(db, 'Users', userEmail, 'Schedule', selectedDate)
			const docSnap = await getDoc(docRef)
			if (docSnap.exists() && docSnap.data()[selectedNickname]) {
				const tasks = docSnap.data()[selectedNickname].task

				if (tasks && Array.isArray(tasks) && tasks.length > 0) {
					setSelectedTasks(tasks)
				} else {
					setSelectedTasks([])
				}
			} else {
				setSelectedTasks([])
			}
			setSelectedDate(selectedDate)
		} catch (error) {
			console.error('Error fetching tasks for selected date:', error)
		}
	}

	function onPress({ task }, index) {
		removeTask(selectedDate, { task }, selectedNickname)
		setSelectedTasks(selectedTasks.splice(index, 1))
	}

	if (!fontsLoaded) {
		return null
	}

	return (
		<View style={styles.page}>
			<SafeAreaView style={styles.containerWrapper}>
				<View style={styles.container}>
					<View style={styles.button}>
						<Dropdown label='plant' />
						{/* <TouchableOpacity onPress={handleDropdownToggle} >
            <Text style={styles.dropdownText}>{selectedNickname || 'Select your plant'}</Text>
          </TouchableOpacity>
          {isVisible && (
            <View>
              {nickNames.map((nickName) => (
                <TouchableOpacity
                  key={nickName}
                  onPress={() => handleDropdownSelect(nickName)}
                >
                  <Text>{nickName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )} */}
					</View>
					<View style={styles.calendarContainer}>
						<Calendar
							onDayPress={handleDayPress}
							// enableSwipeMonths
							theme={{
								backgroundColor: '#E9EBEC',
								calendarBackground: '#E9EBEC',
								textSectionTitleColor: '#b6c1cd',
								selectedDayBackgroundColor: '#00adf5',
								selectedDayTextColor: '#8DC267',
								todayTextColor: '#8DC267',
								dayTextColor: '#2d4150',
								textDisabledColor: '#d9e'
							}}
							// style={styles.calendar}
							markedDates={markedDates}
						/>
					</View>

					{selectedTasks.length > 0 && (
						<View style={styles.taskContainer}>
							<Text style={styles.taskTitle}>Tasks for {selectedDate}:</Text>
							{selectedTasks.map((task: string, index: number) => (
								<View style={styles.taskText} key={index}>
									<Text style={styles.taskText}>{task}</Text>
									<Button
										title='Delete Task'
										onPress={() => {
											onPress({ task }, index)
										}}
									/>
								</View>
							))}
						</View>
					)}
					<View>{selectedDate && <Dropdown label='schedule' />}</View>
				</View>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	page: {
		height: '100%',
		backgroundColor: '#ffffff'
	},
	containerWrapper: {
		height: '89.5%'
	},
	container: {
		height: '100%',
		flex: 1,
		backgroundColor: '#ffffff',
		alignContent: 'center'
	},
	filterDropdownContainer: {
		marginTop: 20
	},
	filterDropdown: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center'
	},
	filterDropdownOptions: {
		borderWidth: 2,
		width: '100%',
		alignItems: 'center',
		position: 'absolute',
		backgroundColor: 'white',
		bottom: -50,
	},
	button: {
		marginTop: 20,
		zIndex: 2,
		borderWidth: 2,
		borderRadius: 50,
		borderColor: '#009172',
		width: '90%',
		alignSelf: 'center',
		justifyContent: 'center',
		height: 60
	},
	buttonText: {
		fontFamily: 'BDO-Grotesk-Med',
		fontSize: 20
	},
	calendarContainer: {
		marginTop: 20,
		zIndex: 1
	},
	calendar: {
		borderWidth: 1,
		borderColor: 'gray'
	},
	taskContainer: {
		alignItems: 'center',
		padding: 20,
		backgroundColor: 'lightgray'
	},
	taskTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10
	},
	taskText: {
		fontSize: 14,
		marginBottom: 5
	},
	dropdownText: {
		fontSize: 20,
		fontFamily: 'BDO-Grotesk-Reg',
	},
	addTaskButton: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2196F3',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 4,
		marginBottom: 10
	},
	addTaskText: {
		color: 'red'
	}
})
