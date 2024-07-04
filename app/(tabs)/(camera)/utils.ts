import * as tf from "@tensorflow/tfjs";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import "@tensorflow/tfjs-react-native";
import * as ort from "onnxruntime-react-native";
import { Alert } from "react-native";
import { Asset } from "expo-asset";
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
  const model = await loadTensorflowModel(require("./model.tflite"));
  const imageTensor = await processImage(imageUri);
  const imageTensorArray: (Float32Array | Int32Array | Uint8Array)[] = [];
  imageTensorArray.push(imageTensor);
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

async function loadOrtModel() {
  try {
    const assets = await Asset.loadAsync(require("./assets/models/best.onnx"));
    const modelUri = assets[0].localUri;
    if (!modelUri) {
      Alert.alert("failed to get model URI", `${assets[0]}`);
    } else {
      const myModel = await ort.InferenceSession.create(modelUri);
      Alert.alert(
        "model loaded successfully",
        `input names: ${myModel.inputNames}, output names: ${myModel.outputNames}`
      );
    }
  } catch (e) {
    Alert.alert("failed to load model", `${e}`);
    throw e;
  }
}

export async function runOrtModel(imageUri: string) {
  // Load and preprocess the image
  const preprocessedImage = await preprocessImage(imageUri);

  // @ts-ignore
  const myModel: ort.InferenceSession = await loadOrtModel();
  try {
    const inputData = new Float32Array(preprocessedImage.dataSync());
    const feeds: Record<string, ort.Tensor> = {};
    feeds[myModel.inputNames[0]] = new ort.Tensor(inputData, [1, 28, 28]);
    const fetches = await myModel.run(feeds);
    const output = fetches[myModel.outputNames[0]];
    if (!output) {
      Alert.alert("failed to get output", `${myModel.outputNames[0]}`);
    } else {
      Alert.alert(
        "model inference successfully",
        `output shape: ${output.dims}, output data: ${output.data}`
      );
    }
  } catch (e) {
    Alert.alert("failed to inference model", `${e}`);
    throw e;
  }
}

async function preprocessImage(imageUri: string) {
  // Load and manipulate the image
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 28, height: 28 } }],
    { format: ImageManipulator.SaveFormat.PNG }
  );

  // Convert the manipulated image to tensor
  const imgB64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const imageTensor = tf.browser.fromPixels({
    // @ts-ignore
    data: Uint8Array.from(atob(imgB64), (c) => c.charCodeAt(0)),
    width: 28,
    height: 28,
    // @ts-ignore
    channels: 1,
  });

  // Normalize the image tensor
  const normalizedImage = imageTensor.div(tf.scalar(255.0));

  return normalizedImage;
}
