import { useEffect, useState } from "react";
import { db } from "../Firebase_Config/firebaseConfig";
import {
  getDocs,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

function FireBaseTrial() {

  const [user, setuser] = useState();
  const [plantID, setplantID] = useState();
  const [nickname, setNickname] = useState();

  //From Spiking
  const [watering, setwatering] = useState(0);
  const [sun, setsun] = useState(0);
  const [plantName, setplantName] = useState(0);
  //From Spiking



  // Get list of plant IDs limited


  function addPlantToUser() {
    const usersData = doc(db, "Users", user);
    const plantToAdd = doc(db, "Plants List", plantID);
    getDoc(usersData)
      .then((result) => {
        let billsData = result.data();

        getDoc(plantToAdd)
          .then((result) => {
            let newPlant = {};
            newPlant["nickname"] = nickname;
            newPlant["common_name"] = result.data().obj.common_name;
            newPlant["id"] = result.data().obj.id;
            newPlant["scientific_name"] = result.data().obj.scientific_name[0];
            newPlant["Image"] = result.data().obj.image_url;
            let dynamicName = newPlant.nickname || newPlant.common_name;
            let dynamicObject = { ...billsData };
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

  useEffect(() => {}, []);

  // UserName needs to be set for this
  function OnSubmit() {
    setDoc(doc(db, username, plantName), testObj[index]);
  }

  return (
    <div>
      <input
        placeholder="Plant Name"
        onChange={(e) => setplantName(e.target.value)}
      />

      <input
        placeholder="watering frequency"
        onChange={(e) => setwatering(e.target.value)}
      />
      <input
        placeholder="amount of sun"
        onChange={(e) => setsun(e.target.value)}
      />
      <button onClick={OnSubmit}>Submit plant</button>

      {console.log(user)}
    </div>
  );
}

export default FireBaseTrial;
