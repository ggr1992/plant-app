import { db } from "../../Firebase_Config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

async function addPlantToUser(user, plantID) {
  async function userExists(user) {
    const usersData = doc(db, "Users", user);
    const docSnapshot = await getDoc(usersData);
    return docSnapshot.exists();
  }

  const userExists2 = await userExists(user);

  if (!userExists2) {
    return Promise.reject({
      msg: "User does not exist",
    }).catch((err) => {
      return err;
    });
  }

  const usersData = doc(db, "Users", user);
  const plantToAdd = doc(db, "Plants List", plantID);
  getDoc(usersData)
    .then((result) => {
      let allUsersData = result.data();

      getDoc(plantToAdd)
        .then((result) => {
          let newPlant = {};
          newPlant["nickname"] = "scumples";
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
