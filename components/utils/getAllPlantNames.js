import { db } from "../../Firebase_Config/firebaseConfig";
import { collection, query,getDocs} from "firebase/firestore";

async function getAllPlantNames(){

   const plants = query(collection(db, "Plants List"));
    let storage = []
    const querySnapshot = await getDocs(plants);
    querySnapshot.forEach((doc) => {
        storage.push({"id":doc.id,"scientific_name":doc.data().obj.scientific_name[0],"common_name": doc.data().obj.common_name});
    });
    return storage
}

module.exports = getAllPlantNames