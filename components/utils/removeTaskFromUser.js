import { db } from "../../Firebase_Config/firebaseConfig";
import { doc, setDoc, arrayRemove } from "firebase/firestore";
import { UserContext } from "../context/User";
import { useContext } from "react";

function removeTask(date, { task }) {
  // const { userEmail } = useContext(UserContext)
  console.log(date);
  console.log(task);

  const orderData = {
    task: arrayRemove(task),
  };

  return setDoc(doc(db, "Users", "Bill", "Schedule", date), orderData, {
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
