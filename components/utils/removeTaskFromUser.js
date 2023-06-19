import { db } from "../../Firebase_Config/firebaseConfig";
import { doc, setDoc, arrayRemove } from "firebase/firestore";
import { UserContext } from '../context/User'
import { useContext } from "react";

function removeTask(date, task) {
const { userEmail } = useContext(UserContext)
   date = "2023-06-1";
   task = "things";
  const orderData = {
    task: arrayRemove(task),
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

export default removeTask;
