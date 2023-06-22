import { db } from "../../Firebase_Config/firebaseConfig";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { UserContext } from "../context/User";
import { useContext } from "react";

function addTaskToUser(date, task, nickName) {
    const { userEmail } = useContext(UserContext)
  const orderData = { 
    [nickName] : {
      task: arrayUnion(task),
    }
  };

  return setDoc(doc(db, "Users", userEmail, "Schedule", date), orderData, {
    merge: true,
  })
    .then(() => {
      return "Order added/updated successfully!";
    })
    .catch((error) => {
      return "Error adding/updating order: ", error;
    });
}

export default addTaskToUser;
