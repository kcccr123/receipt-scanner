import axios from "axios";
import mime from "mime";

export const detectImagePost = async (uri: string) => {
  try {
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
    // gcp: http://35.224.80.149:30001/predict
    // local: http://10.0.2.2:5000/predict
    const serverResponse = await axios.post(
      "http://35.224.80.149:30001/predict",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(serverResponse.data);
  } catch (error) {
    console.error(error);
  }
};

export const sayHello = async (words: string) => {
  console.log("make request");
  try {
    const response = await axios.post("http://35.224.80.149:30001/response", {
      message: words,
    });
    alert(response.data.response);
  } catch (error) {
    console.error(error);
  }
};
