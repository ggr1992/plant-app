const getUserDoc = require("../components/utils/getUserDoc");
const getPlantInfo = require("../components/utils/getPlantsInfo");

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
    )
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
    )
  });
});
