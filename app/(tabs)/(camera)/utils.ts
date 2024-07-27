import * as tf from "@tensorflow/tfjs";
import * as FileSystem from "expo-file-system";
import * as ort from "onnxruntime-react-native";
import "@tensorflow/tfjs-react-native";
import { Asset } from "expo-asset";
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

  console.log("Image data length:", imageData.length);

  const imageTensor = decodeJpeg(imageData, 3);
  console.log("decoded image", imageTensor);

  // Resize the image to 640x640
  const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [640, 640]);
  console.log("Resized image tensor shape:", resizedImageTensor.shape);

  // Normalize the image data to the range [0, 1]
  const normalizedImageTensor = resizedImageTensor.div(tf.scalar(255));
  console.log("Normalized image tensor shape:", normalizedImageTensor.shape);

  // Expand dimensions to add the batch size
  const batchedImageTensor = normalizedImageTensor.expandDims(0);
  console.log("Batched image tensor shape:", batchedImageTensor.shape);

  // Transpose the tensor to match the required shape [1, 3, 640, 640]
  const transposedTensor = batchedImageTensor.transpose([0, 3, 1, 2]);
  console.log("Transposed tensor shape:", transposedTensor.shape);

  console.log(
    "Transposed tensor data length:",
    transposedTensor.dataSync().length
  );

  return transposedTensor;
};

const processImage = async (imageUri: string) => {
  const b64data = await loadImage(imageUri);
  console.log("process image");
  const imageTensor = await uriToTensor(b64data);
  console.log("uri to tensor", imageTensor.shape);

  const returnValue = Float32Array.from(imageTensor.dataSync());
  console.log("Image tensor data length:", returnValue.length);
  return returnValue;
};

export const runOnnxModel = async (imageUri: string) => {
  // load model
  const InferenceSession = ort.InferenceSession;
  const assets = await Asset.loadAsync(
    require("../../../assets/models/smallertest.onnx")
  );
  const modelUri = assets[0].localUri;
  if (modelUri) {
    const session = await InferenceSession.create(modelUri);
    const imageTensorArray = await processImage(imageUri);

    console.log("Image tensor array length:", imageTensorArray.length);

    const inputTensor = new ort.Tensor(
      imageTensorArray,
      [1, 3, 640, 640],
      "float32"
    );
    console.log("ORT tensor data length:", inputTensor.data.length);
    console.log("ORT tensor data type:", inputTensor.type);

    const feeds: Record<string, ort.Tensor> = {};
    feeds[session.inputNames[0]] = inputTensor;

    const fetches = await session.run(feeds);
    console.log("Model run successfully");
    const output = fetches[session.outputNames[0]];

    const numDetections = 8400;
    const outputTensor = output.data as Float32Array;
    const outputArray = Array.from(outputTensor);

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
  }
};
// export const runModelonImage = async (imageUri: string) => {
//   const imageTensorArray = await processImage(imageUri);
//   console.log("tensor retrieved");
//   // console.log("imageTensor retrieved", imageTensorArray);

//   // const model = await loadTensorflowModel(require("./100epoch.tflite"));
//   // console.log("model loaded");

//   const prediction = await model.run([imageTensorArray]);
//   //console.log("prediction", prediction);

//   if (!prediction || prediction.length === 0) {
//     console.error("No prediction results from model");
//     return [];
//   }

//   // Assume the first element in prediction is the output tensor
//   const outputTensor = prediction[0] as Float32Array;
//   const outputArray = Array.from(outputTensor); // Convert TypedArray to regular array
//   //console.log("outputArray", outputArray);
//   console.log(outputArray.length);
//   const numDetections = 8400;

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
//   const scoreThreshold = 100; // Score threshold for NMS

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
//   console.log("nms");

//   const nmsBoxes: DetectionResult[] = indices.arraySync().map((index) => {
//     return {
//       bbox: tfBoxes[index],
//       score: scores[index],
//       class: classes[index],
//     };
//   });
//   console.log("detectionResults", nmsBoxes);
//   console.log(nmsBoxes.length);
//   console.log("hello");
//   return nmsBoxes;
// };
