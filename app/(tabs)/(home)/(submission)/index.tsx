import { View } from "react-native";
import { Button, BottomSheet} from "@rneui/themed";
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
  }, [groupID]);

  return (
    <>
      <View style={buttonStyles.container}>
        <Button buttonStyle={buttonStyles.back_button} onPress={() => router.back()}>Back</Button>
        <Link
          href={{
            pathname: "/displayReceipt",
            params: { groupID: currentGroupId },
          }}
          asChild
        >
          <Button buttonStyle={buttonStyles.button}>
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 26 }}>
              Blank Table
            </Text>
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
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 26 }}>
              Scan Receipt
            </Text>
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
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 26 }}>
              Upload Image
            </Text>
          </Button>
        </Link>
      </View>
    </>
  );
}
