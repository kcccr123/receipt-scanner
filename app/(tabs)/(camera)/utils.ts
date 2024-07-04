import * as tf from "@tensorflow/tfjs";
import * as FileSystem from "expo-file-system";
import "@tensorflow/tfjs-react-native";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { loadTensorflowModel } from "react-native-fast-tflite";

const uriToTensor = async (uri: string) => {
  await tf.ready();
  /*
    const response = await fetch(uri, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer); */

  // Read the file from the provided URI
  console.log(uri);
  const imgB64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  console.log("got b64");
  // Convert base64 string to buffer
  const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
  const uint8Array = new Uint8Array(imgBuffer);

  console.log("what now");
  // Decode the image to a tensor
  const imageTensor = decodeJpeg(uint8Array);
  console.log("hello?");
  return imageTensor;
};

const processImage = async (imageUri: string) => {
  console.log("process image");
  const imageTensor = await uriToTensor(imageUri);
  console.log("uri to tensor");
  return imageTensor.dataSync();
};

export const runModelonImage = async (imageUri: string, modelPath: string) => {
  console.log("hello");
  const model = await loadTensorflowModel(require("./model.tflite"));
  console.log("hello2");
  const imageTensor = await processImage(imageUri);
  console.log("fuck oyu???");
  const imageTensorArray: (Float32Array | Int32Array | Uint8Array)[] = [];
  imageTensorArray.push(imageTensor);
  console.log("fuck oyu");
  const prediction = await model.run(imageTensorArray);

  //console.log(prediction); // Ensure this is an array of TypedArray

  const outputTensor = prediction[0] as Float32Array; // Explicitly cast to Float32Array
  const outputArray = Array.from(outputTensor); // Convert TypedArray to regular array

  const numDetections = 6300;
  const numClasses = 80; // Assuming 80 classes + 1 objectness score + 4 bounding box coords
  const detectionResults: Array<{
    bbox: any;
    objectness: number;
    class: number;
    score: number;
  }> = [];

  for (let i = 0; i < numDetections; i++) {
    const offset = i * 85;
    const bbox = {
      yMin: outputArray[offset + 0],
      xMin: outputArray[offset + 1],
      yMax: outputArray[offset + 2],
      xMax: outputArray[offset + 3],
    };
    const objectness = outputArray[offset + 4];

    // Convert class scores TypedArray to regular array
    const classScoresTypedArray = outputTensor.subarray(
      offset + 5,
      offset + 85
    ) as Float32Array;
    const classScores = Array.from(classScoresTypedArray);

    const maxClassScore = Math.max(...classScores);
    const maxClassIndex = classScores.indexOf(maxClassScore);

    detectionResults.push({
      bbox,
      objectness,
      class: maxClassIndex,
      score: maxClassScore,
    });
  }
  console.log(detectionResults);
  return detectionResults;
};
