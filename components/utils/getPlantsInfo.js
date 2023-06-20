import { db } from "../../Firebase_Config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export function getPlantInfo(plantID) {
  const plant = doc(db, "Plants List", plantID);
  return getDoc(plant)
    .then((result) => {
      return result.data();
    })
    .catch((err) => {
      console.log(err);
    });
}