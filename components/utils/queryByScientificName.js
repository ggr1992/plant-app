import { db } from "../../Firebase_Config/firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";

export default async function queryByScientificName(arr) {
  const plants = query(
    collection(db, "Plants List"),
    where("obj.scientific_name", "array-contains-any", arr)
  );
  let storage = [];
  const querySnapshot = await getDocs(plants);
  querySnapshot.forEach((doc) => {
    storage.push({
      id: doc.data().obj.id,
      scientific_name: doc.data().obj.scientific_name[0],
      common_name: doc.data().obj.common_name,
      image: doc.data().obj.image_url,
    });
  });

  if (storage.length === 0) {
    return ["No Plants Found"];
  }

  return storage;
}
