// import * as tf from "@tensorflow/tfjs";
// import * as FileSystem from "expo-file-system";
// import * as ort from "onnxruntime-react-native";
// import "@tensorflow/tfjs-react-native";
// import { Asset } from "expo-asset";
// import { decodeJpeg } from "@tensorflow/tfjs-react-native";
// import { loadTensorflowModel } from "react-native-fast-tflite";

// type DetectionResult = {
//   bbox: number[];
//   score: number;
//   class: number;
// };

// const loadImage = async (uri: string) => {
//   const imgB64 = await FileSystem.readAsStringAsync(uri, {
//     encoding: FileSystem.EncodingType.Base64,
//   });
//   return imgB64;
// };

// const onnxNms = async (output: ort.Tensor) => {
//   const numDetections = 8400;
//   const outputTensor = output.data as Float32Array;
//   const outputArray = Array.from(outputTensor);

//   const tfBoxes: number[][] = [];
//   const scores: number[] = [];
//   const classes: number[] = [];

//   for (let i = 0; i < numDetections; i++) {
//     const offset = i * 7;

//     // find class with highest prob
//     let classes_scores = outputArray.slice(offset + 4, offset + 7); // Extract class scores
//     let maxScore = Math.max(...classes_scores); // Find max score
//     let maxClassIndex = classes_scores.indexOf(maxScore);

//     if (maxScore >= 0.25) {
//       let box = [
//         outputArray[offset] - 0.5 * outputArray[offset + 2], // x
//         outputArray[offset + 1] - 0.5 * outputArray[offset + 3], // y
//         outputArray[offset + 2], // width
//         outputArray[offset + 3], // height
//       ];

//       // Example threshold
//       tfBoxes.push(box);
//       scores.push(maxScore);
//       classes.push(maxClassIndex);
//     }
//   }

//   const maxOutputSize = 100; // Maximum number of boxes to keep
//   const iouThreshold = 0.1; // IoU threshold for NMS
//   const scoreThreshold = 400; // Score threshold for NMS

//   //console.log("nms begin");
//   //console.log(boxes.length);
//   //console.log(scores.length);
//   //console.log(scores);
//   const indices = await tf.image.nonMaxSuppressionAsync(
//     tfBoxes,
//     scores,
//     maxOutputSize,
//     iouThreshold,
//     scoreThreshold
//   );

//   const nmsBoxes: DetectionResult[] = indices.arraySync().map((index) => {
//     return {
//       bbox: tfBoxes[index],
//       score: scores[index],
//       class: classes[index],
//     };
//   });
//   return nmsBoxes;
// };

// const uriToTensor = async (imgB64: string) => {
//   await tf.ready();

//   const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
//   const imageData = new Uint8Array(imgBuffer);

//   const imageTensor = decodeJpeg(imageData, 3);

//   // Resize the image to 640x640
//   const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [640, 640]);

//   // Normalize the image data to the range [0, 1]
//   const normalizedImageTensor = resizedImageTensor.div(tf.scalar(255));

//   // Expand dimensions to add the batch size
//   const batchedImageTensor = normalizedImageTensor.expandDims(0);

//   // Transpose the tensor to match the required shape [1, 3, 640, 640]
//   const transposedTensor = batchedImageTensor.transpose([0, 3, 1, 2]);

//   return transposedTensor;
// };

// const processImage = async (imageUri: string) => {
//   const b64data = await loadImage(imageUri);
//   const imageTensor = await uriToTensor(b64data);

//   const returnValue = Float32Array.from(imageTensor.dataSync());
//   return returnValue;
// };

// export const runOnnxModel = async (imageUri: string) => {
//   // load model
//   const InferenceSession = ort.InferenceSession;
//   const assets = await Asset.loadAsync(
//     require("../../../assets/models/bestonnx.onnx")
//   );
//   const modelUri = assets[0].localUri;
//   if (modelUri) {
//     const session = await InferenceSession.create(modelUri);
//     const imageTensorArray = await processImage(imageUri);

//     const inputTensor = new ort.Tensor(
//       imageTensorArray,
//       [1, 3, 640, 640],
//       "float32"
//     );

//     const feeds: Record<string, ort.Tensor> = {};
//     feeds[session.inputNames[0]] = inputTensor;

//     const fetches = await session.run(feeds);
//     const output = fetches[session.outputNames[0]];

//     // run non max supression
//     const detections = onnxNms(output);

//     // need to figure out how to validate these detections
//     // start new function to add garys model into the app
//     // in python run predictiosn on same image that app is running model on, and comapre results.
//   }
// };

