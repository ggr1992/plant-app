import { db } from "../../Firebase_Config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

async function addPlantToUser(user, plantID, nickname) {
  plantID = String(plantID);

  const usersData = await doc(db, "Users", user);
  const plantToAdd = await doc(db, "Plants List", plantID);
  getDoc(usersData)
    .then((result) => {
      let allUsersData = result.data();
      getDoc(plantToAdd)
        .then((result) => {
          let newPlant = {};
          newPlant["nickname"] = nickname || result.data().obj.common_name;
          newPlant["common_name"] = result.data().obj.common_name;
          newPlant["id"] = result.data().obj.id;
          newPlant["scientific_name"] = result.data().obj.scientific_name[0];
          newPlant["Image"] = result.data().obj.image_url;
          let dynamicName = newPlant.nickname || newPlant.common_name;
          let dynamicObject = { ...allUsersData };
          dynamicObject[dynamicName] = newPlant;
          return dynamicObject;
        })
        .then((result) => {
          setDoc(doc(db, "Users", user), result);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

export default addPlantToUser;
