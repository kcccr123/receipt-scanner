import axios from "axios";
import mime from "mime";
import { ProcessedReceipt } from "./types";

export const detectImagePost = async (
  uri: string
): Promise<{ status: number; data?: ProcessedReceipt }> => {
  //  get uri and format
  const newImageUri = "file://" + uri.split("file:/").join("");
  console.log(newImageUri);

  // So, FormData object automatically converts image to binary data.
  // its given the image uri, takes the image uri, uses it to get the image and convert to binary data
  // flask takes the formdata in the post request and reads the binary data.

  const formData = new FormData();
  formData.append("image", {
    uri: newImageUri,
    type: mime.getType(newImageUri),
    name: newImageUri.split("/").pop(),
  } as any);
  console.log(formData);
  return await axios
    .post(process.env.EXPO_PUBLIC_LOCAL_URL_PREDICTION as string, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
    })
    .then((response) => {
      console.log(response);
      return { status: response.status, data: response.data };
    })
    .catch((error) => {
      console.log(error);
      if (error.response) {
        console.log("Error response:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Axios error:", error.message);
      }
      return {
        status: error.status,
      };
    });
};

export const detectImagePostGpt = async (
  uri: string
): Promise<{ status: number; data?: ProcessedReceipt }> => {
  // get uri and format
  const newImageUri = "file://" + uri.split("file:/").join("");
  console.log(newImageUri);

  // So, FormData object automatically converts image to binary data.
  // its given the image uri, takes the image uri, uses it to get the image and convert to binary data
  // flask takes the formdata in the post request and reads the binary data.

  const formData = new FormData();
  formData.append("image", {
    uri: newImageUri,
    type: mime.getType(newImageUri),
    name: newImageUri.split("/").pop(),
  } as any);
  console.log(formData);
  console.log(
    process.env.EXPO_PUBLIC_LOCAL_URL_PREDICTION_GPT,
    "URL IS HERE HERE HERE"
  );
  return await axios
    // use gpt instead of our own pipeline
    .post(
      process.env.EXPO_PUBLIC_LOCAL_URL_PREDICTION_GPT as string,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      }
    )
    .then((response) => {
      console.log(response);
      return { status: response.status, data: response.data };
    })
    .catch((error) => {
      console.log(error);
      if (error.response) {
        console.log("Error response:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Axios error:", error.message);
      }
      return {
        status: error.status,
      };
    });
};

export const sayHello = async (words: string) => {
  console.log("make request");
  try {
    const response = await axios.post(
      process.env.EXPO_PUBLIC_LOCAL_URL_RESPONSE as string,
      {
        message: words,
      }
    );
    console.log(response.data[0]);
    alert(response.data[0].name);
  } catch (error) {
    console.error(error);
  }
};
