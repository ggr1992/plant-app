import axios from "axios";

export async function queryByScientificName(arr) {
  return axios
    .post(
      "https://plant-app-backend.onrender.com/plants/search-by-scientific-names",
      { names: arr }
    )
    .then(({ data: { plants } }) => {
      return plants;
    });
}

export async function queryBySearchTerm(searchTerm) {
  return axios
    .get("https://plant-app-backend.onrender.com/plants/search?q=" + searchTerm)
    .then(({ data: { plants } }) => {
      return plants;
    });
}

export async function querySinglePlantByScientificName(scientificName) {
  return axios
    .get(
      "https://plant-app-backend.onrender.com/plants/get-plant-by-name/" +
        scientificName
    )
    .then(({ data: { plant } }) => {
      return plant;
    });
}
