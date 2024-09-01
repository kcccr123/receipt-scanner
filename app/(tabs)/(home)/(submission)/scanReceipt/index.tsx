import { View } from "react-native";
import { Button } from "@rneui/themed";
import { useState } from "react";
import { ItemType } from "@/components/ItemEditor/types";
import { RenderTable } from "@/components/ItemEditor";
import { useRouter } from "expo-router";

import CameraComponent from "@/components/CameraComponent";

export default function displayCameraPage() {
  const router = useRouter();

  return (
    <>
      <Button onPress={() => router.back()}>Back</Button>
      <CameraComponent />
    </>
  );
}
