import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import { CameraView, CameraProps, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as MediaLibrary from "expo-media-library";

import { connectToDb } from "@/app/database/db";
import { addSingleGroup } from "@/app/database/groups";
import { GroupType } from "@/app/(tabs)/types";

import { styles } from "./styles";

export default function CameraComponent({
  groupID,
}: {
  groupID: number | null;
}) {
  // @ts-ignore: just being lazy with types here
  const cameraRef = useRef<CameraView>(undefined);
  const [facing, setFacing] = useState<CameraProps["facing"]>("back");

  const [permission, requestPermission] = useCameraPermissions();
  const [permissionMedia, requestPermissionMedia] =
    MediaLibrary.usePermissions();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [pictureSizes, setPictureSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState(undefined);

  const router = useRouter();

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

  const createNewGroup = async () => {
    const db = await connectToDb();
    const newGroupInfo: GroupType = {
      id: -1,
      name: " ",
      total: 0.0,
      purchase_date: "9999-12-30",
      upload_date: "9999-12-30",
    };

    const newGroupId = await addSingleGroup(db, newGroupInfo);
    return newGroupId;
  };

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync();

    // save photo to media library
    if (photo) {
      if (permissionMedia) {
        await MediaLibrary.createAssetAsync(photo.uri);
      }
      setCapturedImage(photo.uri);
    }
    // pass to next component to begin scanning

    alert(`photo captured with dimensions: ${photo!.width} x ${photo!.height}`);

    if (groupID) {
      router.replace({
        pathname: "/displayReceipt", // The screen you want to navigate to
        params: {
          groupID: groupID,
        },
      });
    } else {
      const newGroupId = await createNewGroup();
      router.replace({
        pathname: "/displayReceipt", // The screen you want to navigate to
        params: {
          groupID: newGroupId,
        },
      });
    }
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
