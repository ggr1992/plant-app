import axios from "axios";

export const identifyPlant = (photoUri) => {
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
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
