import { View } from "react-native";
import { Button } from "@rneui/themed";
import { useState } from "react";
import { ItemType } from "@/components/ItemEditor/types";
import { RenderTable } from "@/components/ItemEditor";
import { useRouter } from "expo-router";

import CameraComponent from "@/components/CameraComponent";

export default function displayCameraPage() {
  const router = useRouter();

  const [recieptItems, setRecieptItems] = useState<ItemType[]>([]);
  const [currentRecieptId, setCurrentRecieptId] = useState<number>(-1);

  return (
    <>
      <Button onPress={() => router.back()}>Back</Button>
      <CameraComponent />
    </>
  );
}
