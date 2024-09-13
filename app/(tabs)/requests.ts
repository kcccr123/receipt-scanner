import axios from "axios";
import mime from "mime";
import { ProcessedReceipt } from "./types";
import { GCP_URL_RESPONSE, GCP_URL_PREDICTION } from "@env";

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
    .post(GCP_URL_PREDICTION, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response);
      return { status: response.status, data: response.data };
    })
    .catch((error) => {
      return {
        status: error.status,
      };
    });
};

export const sayHello = async (words: string) => {
  console.log("make request");
  try {
    const response = await axios.post(GCP_URL_RESPONSE, {
      message: words,
    });
    alert(response.data.response);
  } catch (error) {
    console.error(error);
  }
};
