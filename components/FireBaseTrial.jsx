






// Legacy Page too be deleted after confirmation this isn't needed






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
