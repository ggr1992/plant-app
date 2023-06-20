import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { Calendar } from "react-native-calendars";
import { db } from "../../Firebase_Config/firebaseConfig";
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import removeTask from "../utils/removeTaskFromUser";


export const CalendarScreen: React.FC = () => {
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);


  useEffect(() => {
    // Fetch the marked dates from Firestore
    const fetchMarkedDates = async () => {
      try {
		const querySnapshot = await getDocs(collection(db, 'Users', "Bill", "Schedule"));
        const markedDatesData: { [date: string]: any } = {};
        querySnapshot.forEach((doc) => {
          const date = doc.id;
          console.log(date)
          const markedData = doc.data();
          console.log(markedData)
          markedDatesData[date] = {
            marked: true,
            dotColor: markedData.dotColor, // Assuming dotColor field exists in the database
            task: markedData.task, // Assuming task field exists in the database
          };
        });
        setMarkedDates(markedDatesData);
      } catch (error) {
        console.error('Error fetching marked dates:', error);
      }
    };

    fetchMarkedDates();
  }, []);
  
  
  
  const handleDayPress = async (day) => {

	  
	  try {
		  const selectedDate = day.dateString;
		  const docRef = doc(db, 'Users', "Bill", "Schedule", selectedDate);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
		
        const tasks = docSnap.data().Bubbles.task;
        if (tasks && Array.isArray(tasks) && tasks.length > 0) {
          setSelectedTasks(tasks);
        } else {
          setSelectedTasks([]);
        }
      } else {
        setSelectedTasks([]);
      }
      setSelectedDate(selectedDate);
    } catch (error) {
      console.error('Error fetching tasks for selected date:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        style={styles.calendar}
        markingType="period"
        markedDates={markedDates}
      />
      {selectedTasks.length > 0 && (
        <View style={styles.taskContainer}>
          <Text style={styles.taskTitle}>Tasks for {selectedDate}:</Text>
          {selectedTasks.map((task: string, index: number) => (<>
            <Text key={index} style={styles.taskText}>{task}</Text>
		  <Button key={index} title="Delete Task" onPress={()=>{removeTask(selectedDate,{task})}}/>
		  </>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#ffffff',
	},
	calendar: {
	  marginTop: 20,
	},
	taskContainer: {
	  alignItems: 'center',
	  padding: 20,
	  backgroundColor: 'lightgray',
	},
	taskTitle: {
	  fontSize: 16,
	  fontWeight: 'bold',
	  marginBottom: 10,
	},
	taskText: {
	  fontSize: 14,
	  marginBottom: 5,
	},
  });
