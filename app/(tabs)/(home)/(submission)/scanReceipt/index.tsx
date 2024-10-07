import { View } from "react-native";
import { Button } from "@rneui/themed";
import { useState } from "react";
import { ItemType } from "@/components/ItemEditor/types";
import { RenderTable } from "@/components/ItemEditor";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { otherStyles } from "@/app/(tabs)/main_styles";
import React from "react";
import CameraComponent from "@/components/CameraComponent";

export default function displayCameraPage() {
  const router = useRouter();

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
      <Button
        titleStyle={otherStyles.buttonLabel}
        buttonStyle={{ backgroundColor: "#9b5353" }}
        onPress={() => router.back()}
      >
        Back
      </Button>
      <CameraComponent groupID={currentGroupId} />
    </>
  );
}
