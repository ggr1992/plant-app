import { db } from "../../Firebase_Config/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"

function getUserProfile(name) {
  const user = doc(db, "Users", name, 'Profile', 'userData');
  return getDoc(user)
    .then((result) => {
      return result.data();
    })
    .catch((err) => {
      console.log(err);
    });
}

export default getUserProfile