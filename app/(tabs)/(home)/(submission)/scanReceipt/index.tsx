import { View } from "react-native";
import { Button } from "@rneui/themed";
import { useState } from "react";
import { ItemType } from "@/components/ItemEditor/types";
import { RenderTable } from "@/components/ItemEditor";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import CameraComponent from "@/components/CameraComponent";

export default function displayCameraPage() {
  const { groupID } = useLocalSearchParams();
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (Array.isArray(groupID)) {
        setCurrentGroupId(parseInt(groupID[0], 10));
      } else if (groupID !== undefined) {
        setCurrentGroupId(parseInt(groupID, 10));
      } else {
        setCurrentGroupId(null);
      }
      console.log(groupID, "wowah");
    }, [groupID])
  );

  return (
    <>
      <CameraComponent groupID={currentGroupId} />
    </>
  );
}
