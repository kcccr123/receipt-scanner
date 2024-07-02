import * as tf from '@tensorflow/tfjs';
import * as FileSystem from 'expo-file-system';
import '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import {
    loadTensorflowModel
  } from 'react-native-fast-tflite'


  const uriToTensor = async (uri: string) => {
    // Read the image file as binary
    const imgB64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  
    // Convert the binary data to a Uint8Array
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer);
  
    // Decode the image to a tensor
    const imageTensor = decodeJpeg(raw);
  
    return imageTensor;
  };

const processImage = async (imageUri: string) => {
    const imageTensor = await uriToTensor(imageUri);

    return imageTensor.dataSync();
};
  
export const runModelonImage = async (imageUri: string, modelPath: string) => {
    console.log('hello')
    // @ts-ignore: just being lazy with types here
    const model = await loadTensorflowModel('https://tfhub.dev/google/lite-model/object_detection_v1.tflite');
    console.log('hello2')
    const imageTensor = await processImage(imageUri)
    const imageTensorArray: (Float32Array | Int32Array | Uint8Array)[] = [];
    imageTensorArray.push(imageTensor);

    const prediction = model.run(imageTensorArray);
    //console.log(prediction);
    return prediction
  };