import { View } from "react-native";
import { Button } from "@rneui/themed";
import { Overlay } from "@rneui/themed";
import { buttonStyles } from "./styles";
import { Text } from "@rneui/base";
import { Link } from "expo-router";
import { addSingleReceipt } from "@/app/database/receipts";
import { connectToDb } from "@/app/database/db";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ItemType } from "@/components/ItemEditor/types";
import { useRouter } from "expo-router";

import { RenderTable } from "@/components/ItemEditor";
import CameraComponent from "@/components/CameraComponent";

export default function SubmissionComponent() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isItemsTableVisisble, setItemsVisible] = useState(false);
  const [isCameraActive, setCameraActive] = useState(false);

  const [recieptItems, setRecieptItems] = useState<ItemType[]>([]);
  const [currentRecieptId, setCurrentRecieptId] = useState<number>(-1);

  useEffect(() => {
    if (Array.isArray(id)) {
      setCurrentRecieptId(parseInt(id[0], 10));
    } else if (id !== undefined) {
      setCurrentRecieptId(parseInt(id, 10));
    }
  }, [id]);

  return (
    <>
      <Overlay isVisible={isItemsTableVisisble} fullScreen={true}>
        <Button onPress={() => setItemsVisible(false)}>Back</Button>
        <RenderTable
          receiptID={currentRecieptId}
          items={recieptItems}
          setItems={setRecieptItems}
        />
      </Overlay>

      <Overlay isVisible={isCameraActive} fullScreen={true}>
        <Button onPress={() => setCameraActive(false)}>Back</Button>
        <CameraComponent />
      </Overlay>

      <Button onPress={() => router.back()}>Back</Button>
      <View style={buttonStyles.container}>
        <Button
          buttonStyle={buttonStyles.button}
          onPress={() => setItemsVisible(true)}
        >
          <Text style={buttonStyles.buttonText}>Blank Table</Text>
        </Button>

        <Button
          buttonStyle={buttonStyles.button}
          onPress={() => setCameraActive(true)}
        >
          <Text style={buttonStyles.buttonText}>Scan Receipt</Text>
        </Button>

        <Link href="/displayReciept" asChild>
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
