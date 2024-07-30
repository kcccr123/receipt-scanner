import axios from "axios";
import * as FileSystem from "expo-file-system";

export const detectImagePost = async (uri: string) => {
  let formData = new FormData();
  // FIGURE OUT HOW TO SEND IMAGE DATA TO FLASK AND READ IMAGE DATA

  formData.append("file", {
    uri: uri,
    name: "photo.jpg",
    type: "image/jpeg",
  });

  try {
    const response = await axios.post(
      "http://10.0.2.2:5000/predict",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const sayHello = async (words: string) => {
  try {
    const response = await axios.post("http://10.0.2.2:5000/response", {
      message: words,
    });
    alert(response.data.response);
  } catch (error) {
    console.error(error);
  }
};

