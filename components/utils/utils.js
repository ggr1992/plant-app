import axios from "axios";

export const identifyPlantFromPlantnet = (photoUri) => {
  const formData = new FormData();
  formData.append("images", {
    uri: photoUri,
    name: "image.jpg",
    type: "image/jpeg",
  });
  return axios({
    url: "https://my-api.plantnet.org/v2/identify/all?api-key=2b10jAG9SVbPKssPx5Fu5T1quu",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  })
    .then((res) => {
      const results = res.data.results;
      return results.map((result) => {
        return {
          name: result.species.scientificNameWithoutAuthor,
          probability: result.score,
        };
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const identifyPlantFromPlantId = (imageBase64) => {
  const url = "https://plantid-mock-api.onrender.com/v2/identify";
  return axios({
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      api_key: "test",
      images: [imageBase64],
    },
  })
    .then((res) => {
      const suggestions = res.data.suggestions;
      return suggestions.map((suggestion) => {
        return {
          name: suggestion.plant_name,
          probability: suggestion.probability,
        };
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const identifyPlant = (data, api) => {
  if (api === "plantnet") return identifyPlantFromPlantnet(data.uri);
  if (api === "plantid") return identifyPlantFromPlantId(data.base64);
  return null;
};
