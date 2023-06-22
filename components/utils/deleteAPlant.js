import { db } from "../../Firebase_Config/firebaseConfig";
import { deleteField ,doc,updateDoc} from "firebase/firestore";

function deleteAPlant (username,nickname) {
    const documentRef = doc(db, "Users", username);
    
   return updateDoc(documentRef, {
      [nickname]: deleteField(),
    })
      .then(() => {
        console.log("Field deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting field:", error);
      });
    }

export default deleteAPlant