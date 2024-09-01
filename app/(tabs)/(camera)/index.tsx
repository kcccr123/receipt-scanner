import CameraComponent from "@/components/CameraComponent";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

export default function CameraTab() {
  const router = useRouter();
  const { groupID } = useLocalSearchParams();
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);

  useEffect(() => {
    if (Array.isArray(groupID)) {
      setCurrentGroupId(parseInt(groupID[0], 10));
    } else if (groupID !== undefined) {
      setCurrentGroupId(parseInt(groupID, 10));
    }
    console.log(groupID, "wowah");
  }, [groupID]);

  return (
    <>
      <CameraComponent groupID={currentGroupId} />
    </>
  );
}
