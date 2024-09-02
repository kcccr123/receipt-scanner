import { View } from "react-native";
import { Button } from "@rneui/themed";
import { buttonStyles } from "./styles";
import { Text } from "@rneui/base";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { RenderTable } from "@/components/ItemEditor";
import CameraComponent from "@/components/CameraComponent";

export default function SubmissionComponent() {
  const router = useRouter();
  const { groupID } = useLocalSearchParams();

  const [currentGroupId, setCurrentGroupId] = useState<number>(-1);

  useEffect(() => {
    if (Array.isArray(groupID)) {
      setCurrentGroupId(parseInt(groupID[0], 10));
    } else if (groupID !== undefined) {
      setCurrentGroupId(parseInt(groupID, 10));
    }
    console.log(groupID, "wowah1");
  }, [groupID]);

  return (
    <>
      <Button onPress={() => router.back()}>Back</Button>
      <View style={buttonStyles.container}>
        <Link
          href={{
            pathname: "/displayReceipt",
            params: { groupID: currentGroupId },
          }}
          asChild
        >
          <Button buttonStyle={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>Blank Table</Text>
          </Button>
        </Link>

        <Link
          href={{
            pathname: "/scanReceipt",
            params: { groupID: currentGroupId },
          }}
          asChild
        >
          <Button buttonStyle={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>Scan Receipt</Text>
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/uploadReceipt",
            params: { groupID: currentGroupId },
          }}
          asChild
        >
          <Button
            buttonStyle={buttonStyles.button}
            onPress={() => console.log("add a new receipt")}
          >
            <Text style={buttonStyles.buttonText}>Upload Image</Text>
          </Button>
        </Link>
      </View>
    </>
  );
}
