import { useEffect, useState } from "react";
import { Auth } from "./auth";
import { db } from "../Firebase_Config/firebaseConfig";
import { getDocs, collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";

function FireBaseTrial() {
  const [users, setusers] = useState(0);
  const [watering, setwatering] = useState(0);
  const [sun, setsun] = useState(0);
  const [plantName, setplantName] = useState(0);
  const [nickname, setNickname] = useState('BillyThePlant')

  const list = doc(db, "Users", "Bill");
  useEffect(() => {
    getDoc(list)
      .then((result) => {
       // console.log(result.data())
       
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
        //console.log(result.data())
       
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

// Names, ID, Image

  /// Add plant to user
  const plantToAdd = doc(db, "Plants List", "1");
  const usersData = doc(db, "Users", "Jill");

  useEffect(() => {
    getDoc(usersData)
    .then((result) => {
      let billsData = result.data()

        getDoc(plantToAdd).then((result) => {

    let newPlant = {} 
    newPlant['nickname']=nickname
    newPlant['common_name']=result.data().obj.common_name
    newPlant['id']=result.data().obj.id
    newPlant['scientific_name']=result.data().obj.scientific_name[0]
    newPlant['Image']=result.data().obj.image_url
    let dynamicName = newPlant.nickname || newPlant.common_name
    let dynamicObject = {...billsData}
    dynamicObject[dynamicName]= newPlant

    
     return dynamicObject
    }).then((result) => {
    
    setDoc(doc(db, "Users", "Jill"),
    result
     )
  })
  //       let Plant = { common_name: result.data().obj.common_name}
  //       let dynamicName = Plant.common_name
  //       let dynamicObject = {}
  //       dynamicObject[dynamicName]= Plant
  //       setDoc(doc(db, "Users", "Bill"),

  //       dynamicObject
  // )


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
