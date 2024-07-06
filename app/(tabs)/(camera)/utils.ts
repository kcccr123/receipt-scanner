import * as tf from "@tensorflow/tfjs";
import * as FileSystem from "expo-file-system";
import { fetch } from "@tensorflow/tfjs-react-native";
import "@tensorflow/tfjs-react-native";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { loadTensorflowModel } from "react-native-fast-tflite";

type BoundingBox = {
  yMin: number;
  xMin: number;
  yMax: number;
  xMax: number;
};

type DetectionResult = {
  bbox: BoundingBox;
  score: number;
  class: number;
};

const uriToTensor = async (uri: string) => {
  await tf.ready();

  // Read the file from the provided URI
  /*
  console.log(uri);
  const imgB64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  console.log("got b64");

  // Convert base64 string to buffer
  const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
  const uint8Array = new Uint8Array(imgBuffer);

  console.log("what now");*/

  console.log("decoding");
  const imageUri = uri;
  const response = await fetch(imageUri, {}, { isBinary: true });
  const imageDataArrayBuffer = await response.arrayBuffer();
  const imageData = new Uint8Array(imageDataArrayBuffer);

  // Decode the image to a tensor
  const imageTensor = decodeJpeg(imageData);
  console.log("decoded image");

  // Resize the image to 640x640
  const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [640, 640]);
  console.log("resized image");

  return resizedImageTensor;
};

const processImage = async (imageUri: string) => {
  console.log("process image");
  const imageTensor = await uriToTensor(imageUri);
  console.log("uri to tensor");
  return imageTensor.dataSync();
};

export const runModelonImage = async (imageUri: string) => {
  const model = await loadTensorflowModel(require("./pretrained32.tflite"));
  const imageTensor = await processImage(imageUri);
  console.log("imageTensor retrieved", imageTensor);

  const imageTensorArray = [imageTensor];

  const prediction = await model.run(imageTensorArray);
  console.log("prediction", prediction);

  if (!prediction || prediction.length === 0) {
    console.error("No prediction results from model");
    return [];
  }

  // Assume the first element in prediction is the output tensor
  const outputTensor = prediction[0] as Float32Array;
  const outputArray = Array.from(outputTensor); // Convert TypedArray to regular array
  //console.log("outputArray", outputArray);

  const numDetections = 8400;

  const boxes: BoundingBox[] = [];
  const tfBoxes: number[][] = [];
  const scores: number[] = [];
  const classes: number[] = [];

  for (let i = 0; i < numDetections; i++) {
    const offset = i * 7;
    const bbox = {
      yMin: outputArray[offset + 0],
      xMin: outputArray[offset + 1],
      yMax: outputArray[offset + 2],
      xMax: outputArray[offset + 3],
    };
    const temp = [];
    temp.push(outputArray[offset + 0]);
    temp.push(outputArray[offset + 1]);
    temp.push(outputArray[offset + 2]);
    temp.push(outputArray[offset + 3]);
    tfBoxes.push(temp);

    const objectness = outputArray[offset + 4];
    const class1Score = outputArray[offset + 5];
    const class2Score = outputArray[offset + 6];
    const maxClassScore = Math.max(class1Score, class2Score);
    const maxClassIndex = class1Score > class2Score ? 0 : 1;

    if (objectness > 0.5) {
      // Example threshold
      boxes.push(bbox);
      scores.push(objectness);
      classes.push(maxClassIndex);
    }
  }

  const maxOutputSize = 100; // Maximum number of boxes to keep
  const iouThreshold = 0.5; // IoU threshold for NMS
  const scoreThreshold = 0.5; // Score threshold for NMS

  console.log("nms begin");
  const indices = await tf.image.nonMaxSuppressionAsync(
    tfBoxes,
    scores,
    maxOutputSize,
    iouThreshold,
    scoreThreshold
  );
  console.log("nms");

  const nmsBoxes: DetectionResult[] = indices.arraySync().map((index) => {
    return {
      bbox: {
        yMin: boxes[index].yMin,
        xMin: boxes[index].xMin,
        yMax: boxes[index].yMax,
        xMax: boxes[index].xMax,
      },
      score: scores[index],
      class: classes[index],
    };
  });
  console.log("detectionResults", nmsBoxes);
  console.log("hello");
  return nmsBoxes;
};

/*
export const runModelonStaticImage = async (imageUri: string) => {
  console.log("hello");
  const model = await loadTensorflowModel(
    require("models/best_float32.tflite")
  );
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
};*/
