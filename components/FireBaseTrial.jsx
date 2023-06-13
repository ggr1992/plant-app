import { useEffect, useState } from "react";
import { Auth } from "./auth";
import { db } from "../Firebase_Config/firebaseConfig";
import { getDocs, collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";

function FireBaseTrial() {
  const [users, setusers] = useState(0);
  const [watering, setwatering] = useState(0);
  const [sun, setsun] = useState(0);
  const [plantName, setplantName] = useState(0);

  const list = doc(db, "Users", "Bill");
  useEffect(() => {
    getDoc(list)
      .then((result) => {
        console.log(result.data())
       
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

// Get list of plant IDs limited

const plant = doc(db, "Plants List", "1");
  useEffect(() => {
    getDoc(plant)
      .then((result) => {
        console.log(result.data())
       
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

// Names, ID, Image

  /// Add plant to user
  const plantToAdd = doc(db, "Plants List", "1");
  useEffect(() => {
    getDoc(plantToAdd)
      .then((result) => {

        let Plant = { common_name: result.data().obj.common_name}
        let dynamicName = Plant.common_name
        let dynamicName2 = "Plant.common_name"

        let dynamicObject = {}
        dynamicObject[dynamicName]= Plant
        let dynamicObject2 = {}
        dynamicObject2[dynamicName2]= Plant

        // console.log(result.data().obj)
        setDoc(doc(db, "Users", "Bill"),

        dynamicObject
  )


})
      .catch((err) => {
        console.log(err);
      });
  }, []);


// UserName needs to be set for this
  function OnSubmit() {
    setDoc(doc(db, username, plantName), testObj[index]);
  }

  return (
    <div>
      <Auth />

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

      {console.log(users)}
    </div>
  );
}

export default FireBaseTrial;
