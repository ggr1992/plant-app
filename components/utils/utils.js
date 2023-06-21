import axios from "axios";

export const identifyPlantFromPlantId = (image) => {
  const url =
    "https://plant-app-backend.onrender.com/plants/identify/plant-id-mock";
  return axios({
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      images: [image.base64],
    },
  })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};
