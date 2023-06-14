import axios from "axios";

export const identifyPlant = (base64Image) => {
  const data = new FormData();
  //   data.append("images", [base64Image]);
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  return axios
    .post(
      "https://my-api.plantnet.org/v2/identify/all?api-key=2b10jAG9SVbPKssPx5Fu5T1quu",
      data,
      headers
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
      console.log(err);
    });
};
