import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import { CameraView, CameraProps, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

import {runOnnxModel } from "./utils";

import { styles } from "./styles";

export default function CameraTab() {
  // @ts-ignore: just being lazy with types here
  const cameraRef = useRef<CameraView>(undefined);
  const [facing, setFacing] = useState<CameraProps["facing"]>("back");

  const [permission, requestPermission] = useCameraPermissions();
  const [permissionMedia, requestPermissionMedia] =
    MediaLibrary.usePermissions();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [pictureSizes, setPictureSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState(undefined);

  useEffect(() => {
    async function getSizes() {
      console.log(permission);
      if (permission?.granted && cameraRef.current) {
        console.log("sized!");
        const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
        setPictureSizes(sizes);
        console.log(sizes);
      }
    }

    getSizes();
  }, [permission, cameraRef]);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync();

    // save photo to media library
    if (photo) {
      if (permissionMedia) {
        await MediaLibrary.createAssetAsync(photo.uri);
      }
      setCapturedImage(photo.uri);
      runOnnxModel(photo.uri);
    }
    // pass to next component to begin scanning

    alert(`photo captured with dimensions: ${photo!.width} x ${photo!.height}`);
    //console.log(JSON.stringify(photo));
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (!permissionMedia) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permissionMedia.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use your media library
        </Text>
        <Button onPress={requestPermissionMedia} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          pictureSize={selectedSize}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Ionicons name="radio-button-on" size={80} color="black" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </View>
  );
}
