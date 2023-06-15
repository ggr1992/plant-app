const getUserDoc = require("../components/utils/getUserDoc");
const getPlantInfo = require("../components/utils/getPlantsInfo");
const addPlantToUser = require("../components/utils/addPlantToUser");
const getAllPlantNames = require("../components/utils/getAllPlantNames");
const queryByScientificName = require("../components/utils/queryByScientificName");

import { db } from "../Firebase_Config/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

afterEach(() => {
  const currentTestName = expect.getState().currentTestName.trim();

  if (currentTestName === "Adds plant to user") {
    setDoc(doc(db, "Users", "Ajai"), {});
  }
});

describe("getUserDoc", () => {
  test("Returns User information when passed their ID name", async () => {
    const result = await getUserDoc("Bill");
    let obj = Object.keys(result);

    expect(result[obj[0]]).toEqual(
      expect.objectContaining({
        common_name: expect.any(String),
        id: expect.any(Number),
        Image: expect.any(String),
        scientific_name: expect.any(String),
        nickname: expect.any(String),
      })
    );
  });
  test("", async () => {
    const result = await getUserDoc("Jill");
    let obj = Object.keys(result);

    expect(result[obj[0]]).toEqual(
      expect.objectContaining({
        common_name: expect.any(String),
        id: expect.any(Number),
        Image: expect.any(String),
        scientific_name: expect.any(String),
        nickname: expect.any(String),
      })
    );
  });
});
describe("getPlantInfo", () => {
  test("Returns User information when passed their ID", async () => {
    const result = await getPlantInfo("1");
    let obj = Object.keys(result);

    expect(result[obj[0]]).toEqual(
      expect.objectContaining({
        dimension: expect.any(String),
        sunlight: expect.any(Array),
        common_name: expect.any(String),
        plant_description: expect.any(String),
        pruning_description: expect.any(String),
        sunlight_description: expect.any(String),
        propagation: expect.any(Array),
        watering: expect.any(String),
        id: expect.any(Number),
        soil: expect.any(Array),
        origin: expect.any(Array),
        indoor: expect.any(Boolean),
        type: expect.any(String),
        other_name: expect.any(Array),
        dimension: expect.any(String),
        scientific_name: expect.any(Array),
        watering_description: expect.any(String),
        image_url: expect.any(String),
      })
    );
  });
  test("", async () => {
    const result = await getPlantInfo("2");
    let obj = Object.keys(result);

    expect(result[obj[0]]).toEqual(
      expect.objectContaining({
        dimension: expect.any(String),
        sunlight: expect.any(Array),
        common_name: expect.any(String),
        plant_description: expect.any(String),
        pruning_description: expect.any(String),
        sunlight_description: expect.any(String),
        propagation: expect.any(Array),
        watering: expect.any(String),
        id: expect.any(Number),
        soil: expect.any(Array),
        origin: expect.any(Array),
        indoor: expect.any(Boolean),
        type: expect.any(String),
        other_name: expect.any(Array),
        dimension: expect.any(String),
        scientific_name: expect.any(Array),
        watering_description: expect.any(String),
        image_url: expect.any(String),
      })
    );
  });
});
describe("", () => {
  test("Fails if User does not exist", async () => {
    const test = await addPlantToUser("Charlie", "13");
    expect(test.msg).toBe("User does not exist");
  });
  test("Adds plant to user", async () => {
    await addPlantToUser("Ajai", "13");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const result = await getUserDoc("Ajai");
    let obj = Object.keys(result);

    expect(result[obj[0]]).toEqual(
      expect.objectContaining({
        common_name: expect.any(String),
        id: 13,
        Image: expect.any(String),
        scientific_name: expect.any(String),
        nickname: expect.any(String),
      })
    );
  });
});
describe("getAllPlantNames", () => {
  test("", async () => {
    const result = await getAllPlantNames();
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toEqual(
        expect.objectContaining({
          common_name: expect.any(String),
          id: expect.any(Number),
          scientific_name: expect.any(String),
        })
      );
    }
  });
});

describe("queryByScientificName", () => {
  test("", async () => {
    const result = await queryByScientificName([
      "Malus 'Ambrosia'",
      "Alocasia amazonica 'Polly'",
    ]);

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toEqual(
        expect.objectContaining({
          common_name: expect.any(String),
          id: expect.any(Number),
          scientific_name: expect.any(String),
          image: expect.any(String),
        })
      );
    }
  });

  test("When there are no matches, the functions notifies the user", async () => {
    const result = await queryByScientificName(["Silly"]);
    console.log(result);

    expect(result[0]).toBe("No Plants Found");
  });
});

// console.log(ans)
