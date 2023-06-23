import { FC, useState, useEffect, useContext } from 'react'
import {
	View,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	Button,
	Pressable,
	Switch
} from 'react-native'
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
	const [refresh, setRefresh] = useState(false)

	const [savedPlantsVisible, setSavedPlantsVisible] = useState(false)
	const [addTasksVisible, setAddTasksVisible] = useState(false)
	const [displayTasks, setDisplayTasks] = useState(false)

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

	function addATask(switchState) {
		const taskName = switchState ? 'Prune' : 'Water'
		if (!selectedNickname) {
			return
		}
		let counter = slicedDate
		const startDate = dayjs(selectedDate).format().slice(0, 10)
		let task = `${taskName} ${selectedNickname}`
		addTaskToUser(startDate, task, selectedNickname, userEmail)
		setMarkedDates({ ...markedDates, [counter]: { marked: true } })
		for (let i = 0; i < repeatedDays; i++) {
			let task = `${taskName} ${selectedNickname}`
			addTaskToUser(counter, task, selectedNickname, userEmail)
			setMarkedDates({ ...markedDates, [counter]: { marked: true } })
			counter = dayjs(counter).add(wateringDays, 'day').format().slice(0, 10)
		}
		setRefresh(!refresh)
	}

	interface DropdownProps {
		label: string
	}

	function Dropdown({ label }: DropdownProps) {
		const [isEnabled, setIsEnabled] = useState(false)
		const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

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
						<View style={styles.filterDropdownOptions}>
							{nickNames.map((nickName) => (
								<TouchableOpacity key={nickName} onPress={() => handleDropdownSelect(nickName)}>
									<Text style={styles.dropdownText}>{nickName}</Text>
								</TouchableOpacity>
							))}
						</View>
					)}
				</Pressable>
			)
		} else if (label === 'schedule') {
			return (
				<>
					{selectedDate && selectedNickname ? (
						<TouchableOpacity style={styles.addTaskButton} onPress={toggleTasksDropDown}>
							{!displayTasks ? (
								<Text style={{ fontFamily: 'BDO-Grotesk-Light', fontSize: 18 }}>
									<Text style={{ fontFamily: 'BDO-Grotesk-Med' }}>Set Schedule</Text> / View Tasks
								</Text>
							) : (
								<Text style={{ fontFamily: 'BDO-Grotesk-Light', fontSize: 18 }}>
									Set Schedule / <Text style={{ fontFamily: 'BDO-Grotesk-Med' }}>View Tasks</Text>
								</Text>
							)}
						</TouchableOpacity>
					) : (
						<></>
					)}
					{addTasksVisible && (
						<View style={styles.scheduleDropdown}>
							<View style={styles.switch}>
								<Text style={styles.switchText}>Watering</Text>
								<Switch
									trackColor={{ false: '#1CAC78', true: '#D3D3D3' }}
									thumbColor={isEnabled ? '#00A36C' : '#4B9CD3'}
									onValueChange={toggleSwitch}
									value={isEnabled}
								/>
								<Text style={styles.switchText}>Pruning</Text>
							</View>
							<View style={styles.taskInputContainerWrapper}>
								<View style={styles.taskInputContainer}>
									<Text style={styles.taskInputLabel}>Set scheduling frequency (in days)</Text>
									<TextInput
										style={styles.taskInputField}
										placeholder='enter days here'
										keyboardType='number-pad'
										value={String(wateringDays)}
										onChangeText={(text) =>
											setWateringDays(() => {
												if (text) {
													return parseInt(text)
												} else {
													return 0
												}
											})
										}></TextInput>
								</View>
								<View style={styles.taskInputContainer}>
									<Text style={styles.taskInputLabel}>Schedule to repeat how many times</Text>
									<TextInput
										style={styles.taskInputField}
										placeholder='How many times'
										keyboardType='number-pad'
										value={String(repeatedDays)}
										onChangeText={(text) =>
											setRepeatedDays(() => {
												if (text) {
													return parseInt(text)
												} else {
													return 0
												}
											})
										}></TextInput>
								</View>
							</View>
							<TouchableOpacity style={styles.addTaskButton} onPress={() => addATask(isEnabled)}>
								<Text style={styles.addTaskText}>Confirm</Text>
							</TouchableOpacity>
						</View>
					)}
					{displayTasks && (
						<View style={styles.taskContainer}>
							<Text style={styles.taskTitle}>Tasks for {selectedDate}:</Text>
							{selectedTasks.map((task: string, index: number) => (
								<View style={styles.taskItem} key={index}>
									<Text style={styles.taskText}>{task}</Text>
									<Pressable
										onPress={() => {
											setTimeout(() => onPress({ task }, index), 100)
										}}>
										<Icon size={30} name='checksquareo' />
									</Pressable>
								</View>
							))}
						</View>
					)}
				</>
			)
		}
	}

	useEffect(() => {
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
							let tasks = markedData.task.map((element) => {
								const splitArr = element.split(' ')
								const task = splitArr[0]
								return task
							})
							const wateringDot = { key: 'wateringDot', color: 'blue' }
							const pruningDot = { key: 'pruningDot', color: 'green' }
							markedDatesData[date] = {
								marked: true,
								dots:
									tasks.length === 2
										? [wateringDot, pruningDot]
										: tasks[0] === 'Water'
										? [wateringDot]
										: tasks[0] === 'Prune'
										? [pruningDot]
										: 'red'
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
	}, [selectedNickname, selectedTasks, refresh])

	useEffect(() => {
		if (addTasksVisible) {
			setDisplayTasks(false)
		} else if (selectedTasks.length > 0 && selectedDate) {
			setDisplayTasks(true)
		} else {
			setDisplayTasks(false)
		}
	}, [selectedTasks, selectedDate, addTasksVisible])

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

	function onPress({ task }, index): void {
		removeTask(selectedDate, { task }, selectedNickname, userEmail)
		setSelectedTasks((currentArr) => {
			const newArr = [...currentArr]
			newArr.splice(index, 1)
			return newArr
		})
		if (selectedTasks.length === 0) {
			setSelectedDate('')
		}
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
					</View>
					<View style={styles.calendarContainer}>
						<Calendar
							onDayPress={handleDayPress}
							theme={{
								backgroundColor: '#ffffff',
								calendarBackground: '#ffffff',
								textSectionTitleColor: '#b6c1cd',
								selectedDayBackgroundColor: '#70ee70',
								selectedDayTextColor: '#2d4150',
								todayTextColor: '#2d4150',
								dayTextColor: '#2d4150',
								textDisabledColor: '#d9e'
							}}
							markingType={'multi-dot'}
							markedDates={{ ...markedDates, [selectedDate]: { ...markedDates[selectedDate], selected: true } }}
						/>
					</View>
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
		justifyContent: 'center',
		columnGap: 15
	},
	filterDropdownOptions: {
		alignSelf: 'center',
		paddingVertical: 5,
		borderWidth: 2,
		borderColor: '#009172',
		borderRadius: 30,
		width: '80%',
		alignItems: 'center',
		position: 'absolute',
		backgroundColor: 'white',
		top: 60
	},
	switchText: {
		fontFamily: 'BDO-Grotesk-Light',
		fontSize: 16
	},
	switch: {
		flexDirection: 'row',
		columnGap: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	scheduleDropdown: {
		alignItems: 'center',
		rowGap: 10
	},
	scheduleText: {
		fontFamily: 'BDO-Grotesk-Reg',
		fontSize: 16
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
		alignSelf: 'center',
		width: '70%',
		borderWidth: 1,
		borderRadius: 20,
		borderColor: 'black',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#ffffff'
	},
	taskInputContainerWrapper: {
		rowGap: 10
	},
	taskTitle: {
		fontFamily: 'BDO-Grotesk-Med',
		fontSize: 18,
		marginBottom: 10
	},
	taskInputContainer: {
		flexDirection: 'row',
		columnGap: 10
	},
	taskInputField: {
		borderWidth: 1,
		borderRadius: 40,
		textAlign: 'center',
		fontFamily: 'BDO-Grotesk-Reg',
		fontSize: 18,
		width: 40
	},
	taskInputLabel: {
		fontFamily: 'BDO-Grotesk-Reg',
		fontSize: 18
	},
	taskText: {
		fontFamily: 'BDO-Grotesk-Reg',
		fontSize: 16
	},
	taskItem: {
		flexDirection: 'row',
		columnGap: 10,
		alignItems: 'center'
	},
	dropdownText: {
		fontSize: 20,
		fontFamily: 'BDO-Grotesk-Reg'
	},
	addTaskButton: {
		alignSelf: 'center',
		width: 'auto',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderWidth: 1,
		borderRadius: 30,
		marginBottom: 10
	},
	addTaskText: {
		fontFamily: 'BDO-Grotesk-Med',
		fontSize: 18
	}
})
