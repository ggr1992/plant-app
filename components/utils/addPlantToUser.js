import { db } from "../../Firebase_Config/firebaseConfig";
import { doc, getDoc,setDoc,collection } from "firebase/firestore";

//const [nickname, setNickname] = useState();

function addPlantToUser(user,plantID) {
    const docRef = db.collection("User").doc(user);
    docRef.get().then((doc) => {
        if (doc.exists) {
          // Document exists, check if it has any fields
          if (doc.data()) {
            // Document has fields
            console.log("Document exists and has fields.");
          } else {
            // Document exists but has no fields
            console.log("Document exists but has no fields.");
          }
        } else {
          // Document does not exist
          console.log("Document does not exist.");
        }
      })
    const usersData = doc(db, "Users", user);

    if(!usersData.data) {
        
        return Promise.reject({
            msg: "User does not exist",
          }).catch((err) => {
            return err
          });
    }
    const plantToAdd = doc(db, "Plants List", plantID);
    getDoc(usersData)
      .then((result) => {
        let allUsersData = result.data();

        getDoc(plantToAdd)
          .then((result) => {
            let newPlant = {};
            newPlant["nickname"] = 'scumples';
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

  module.exports = addPlantToUser;