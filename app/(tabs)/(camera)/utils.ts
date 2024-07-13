import * as tf from "@tensorflow/tfjs";
import * as FileSystem from "expo-file-system";
import "@tensorflow/tfjs-react-native";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { loadTensorflowModel } from "react-native-fast-tflite";

type DetectionResult = {
  bbox: number[];
  score: number;
  class: number;
};

const loadImage = async (uri: string) => {
  const imgB64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return imgB64;
};

const uriToTensor = async (imgB64: string) => {
  await tf.ready();
  console.log("decoding");

  const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
  const imageData = new Uint8Array(imgBuffer);

  const imageTensor = decodeJpeg(imageData);
  console.log("decoded image");

  // Resize the image to 640x640
  const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [640, 640]);
  console.log("resized image");
  return resizedImageTensor;
};

const processImage = async (imageUri: string) => {
  const b64data = await loadImage(imageUri);
  console.log("process image");
  const imageTensor = await uriToTensor(b64data);
  console.log("uri to tensor");
  const returnValue = await imageTensor.data();
  console.log("fucked here here fucked");
  return returnValue;
};

export const runModelonImage = async (imageUri: string) => {
  const imageTensorArray = await processImage(imageUri);
  console.log("tensor retrieved");
  // console.log("imageTensor retrieved", imageTensorArray);

  const model = await loadTensorflowModel(require("./100epoch.tflite"));
  console.log("model loaded");

  const prediction = await model.run([imageTensorArray]);
  //console.log("prediction", prediction);

  if (!prediction || prediction.length === 0) {
    console.error("No prediction results from model");
    return [];
  }

  // Assume the first element in prediction is the output tensor
  const outputTensor = prediction[0] as Float32Array;
  const outputArray = Array.from(outputTensor); // Convert TypedArray to regular array
  //console.log("outputArray", outputArray);
  console.log(outputArray.length);
  const numDetections = 8400;

  const tfBoxes: number[][] = [];
  const scores: number[] = [];
  const classes: number[] = [];

  for (let i = 0; i < numDetections; i++) {
    const offset = i * 7;

    // find class with highest prob
    let classes_scores = outputArray.slice(offset + 4, offset + 7); // Extract class scores
    let maxScore = Math.max(...classes_scores); // Find max score
    let maxClassIndex = classes_scores.indexOf(maxScore);

    if (maxScore >= 0.25) {
      let box = [
        outputArray[offset] - 0.5 * outputArray[offset + 2], // x
        outputArray[offset + 1] - 0.5 * outputArray[offset + 3], // y
        outputArray[offset + 2], // width
        outputArray[offset + 3], // height
      ];

      // Example threshold
      tfBoxes.push(box);
      scores.push(maxScore);
      classes.push(maxClassIndex);
    }
  }

  const maxOutputSize = 100; // Maximum number of boxes to keep
  const iouThreshold = 0.1; // IoU threshold for NMS
  const scoreThreshold = 100; // Score threshold for NMS

  //console.log("nms begin");
  //console.log(boxes.length);
  //console.log(scores.length);
  //console.log(scores);
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
      bbox: tfBoxes[index],
      score: scores[index],
      class: classes[index],
    };
  });
  console.log("detectionResults", nmsBoxes);
  console.log(nmsBoxes.length);
  console.log("hello");
  return nmsBoxes;
};
