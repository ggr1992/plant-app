import { db } from "../../Firebase_Config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function getUserDoc(name) {
  const user = doc(db, "Users", name);
  return getDoc(user)
    .then((result) => {
      return result.data();
    })
    .catch((err) => {
      console.log(err);
    });
}

export default getUserDoc;
