import { db } from "../../Firebase_Config/firebaseConfig";
import { collection, query, getDocs, where, limit } from "firebase/firestore";

async function exactScienticNameSearch(name) {
  const plantsQuery = query(
    collection(db, "Plants List"),
    where("obj.scientific_name", "array-contains", String(name)),
    limit(1)
  );

  const querySnapshot = await getDocs(plantsQuery);
  let plant = {};

  querySnapshot.forEach((doc) => {
    plant = { plant: { ...doc.data().obj } };
  });

  return plant;
}

module.exports = exactScienticNameSearch;
