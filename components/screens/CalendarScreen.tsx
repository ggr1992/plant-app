import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button , TouchableOpacity} from "react-native";
import { Calendar } from "react-native-calendars";
import { db } from "../../Firebase_Config/firebaseConfig";
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import removeTask from "../utils/removeTaskFromUser";
import getUserDoc from "../utils/getUserDoc";


export const CalendarScreen: React.FC = (nickName) => {
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [nickNames, setNickNames] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false);
  const [selectedNickname, setSelectedNickname] = useState(null);
  nickName = "Bubbles";
 
  const handleDropdownToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleDropdownSelect = (nickNames) => {
    setSelectedNickname(nickNames);
    setIsVisible(false);
  };
console.log(selectedNickname)

  useEffect(() => {
    getUserDoc('Bill').then((result) => {
      setNickNames(Object.keys(result))
   })
  },[])
 

  useEffect(() => {
    // Fetch the marked dates from Firestore
    const fetchMarkedDates = async () => {
      try {
		const querySnapshot = await getDocs(collection(db, 'Users', "Bill", "Schedule"));
        const markedDatesData: { [date: string]: any } = {};
        querySnapshot.forEach((doc) => {
          const date = doc.id;
        
          const markedData = doc.data().nickName;
          
          markedDatesData[date] = {
            marked: true,
            //dotColor: markedData.nickName.dotColor, // Assuming dotColor field exists in the database
          //  task: markedData.nickName.task, // Assuming task field exists in the database
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
		
        const tasks = docSnap.data()[nickName].task;
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

  function onPress ({task},index) {
   removeTask(selectedDate,{task},nickName)
   setSelectedTasks(selectedTasks.toSpliced(index,1))
  }

  return (
    
    <View style={styles.container}>
       <View>
      <TouchableOpacity onPress={handleDropdownToggle} >
        <Text style={styles.dropdownText}>{selectedNickname || 'Select your plant'}</Text>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.dropdownList}>
          {nickNames.map((nickName) => (
            <TouchableOpacity
              key={nickName}
              onPress={() => handleDropdownSelect(nickName)}
            >
              <Text>{nickName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      </View>
        <Calendar
          onDayPress={handleDayPress}
          style={styles.calendar}
          markingType="period"
          markedDates={markedDates}
        />
        {selectedTasks.length > 0 && (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>Tasks for {selectedDate}:</Text>
            {selectedTasks.map((task: string, index: number) => (<View style={styles.taskText} key={index}>
              <Text  style={styles.taskText}>{task}</Text>
        <Button title="Delete Task" onPress={()=>{onPress({task},index)}}/>
        </View>
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
  dropdownText: {
    fontSize: 14,
  },
  dropdownList: {
   
  },
  });
