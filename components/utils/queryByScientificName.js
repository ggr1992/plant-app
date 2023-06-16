import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase_Config/firebaseConfig';

async function queryByScientificName(arr) {
  const plantsCollection = collection(db, 'Plants List');
  const querySnapshot = await getDocs(plantsCollection);

  const storage = [];
  querySnapshot.forEach((doc) => {
    const scientificName = doc.data().obj.scientific_name[0];
    if (arr.some((partialName) => scientificName.includes(partialName))) {
      storage.push({
        id: doc.data().obj.id,
        scientific_name: scientificName,
        common_name: doc.data().obj.common_name,
        image: doc.data().obj.image_url,
      });
    }
  });

  if (storage.length === 0) {
    return ['No Plants Found'];
  }

  return storage;
}

module.exports = queryByScientificName;
