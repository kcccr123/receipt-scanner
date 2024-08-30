import { Button } from "@rneui/themed";
import { useState, useEffect } from "react";
import { ItemType } from "@/components/ItemEditor/types";
import { Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { connectToDb } from "@/app/database/db";

import { addSingleReceipt } from "@/app/database/receipts";
import { addItem } from "@/app/database/items";
import { ReceiptType } from "@/app/(tabs)/types";
import { RenderTable } from "@/components/ItemEditor";
import { receiptTableStyles } from "./styles";

export default function displayRecieptTablePage() {
  const router = useRouter();
  const { groupID } = useLocalSearchParams();
  const [currentGroupId, setCurrentGroupId] = useState<number>(-1);
  const [receiptItems, setRecieptItems] = useState<ItemType[]>([]);
  const [receiptName, setReceiptName] = useState<string>("");
  const [receiptTotal, setReceiptTotal] = useState<number>(0.0);
  // need to create reciewpt on create reciept and not before
  useEffect(() => {
    console.log(receiptItems);
  }, [receiptItems]);

  useEffect(() => {
    if (Array.isArray(groupID)) {
      setCurrentGroupId(parseInt(groupID[0], 10));
    } else if (groupID !== undefined) {
      setCurrentGroupId(parseInt(groupID, 10));
    }
    console.log(groupID, "wowah");
  }, [groupID]);

  const onCreateReciept = async () => {
    const db = await connectToDb();
    console.log(currentGroupId);
    const receiptInfo = {
      id: -1,
      group_id: currentGroupId,
      name: receiptName,
      total: receiptTotal,
    };

    const recieptId = await addSingleReceipt(db, receiptInfo);
    const itemsToAdd = JSON.parse(JSON.stringify(receiptItems));
    for (let i = 0; i < itemsToAdd.length; i++) {
      itemsToAdd[i].recieptId = recieptId;
    }
    await addItem(db, itemsToAdd);
    console.log("added items", itemsToAdd);

    console.log("end");
    router.replace({
      pathname: "/(displayGroup)", // The screen you want to navigate to
      params: {
        groupID: groupID,
      },
    });
    setRecieptItems([]);
  };

  return (
    <>
      <Button onPress={() => router.back()}>Back</Button>

      <Input
        style={receiptTableStyles.input}
        leftIcon={{ type: "font-awesome", name: "chevron-left" }}
        label={"Name"}
      />
      <Input
        style={receiptTableStyles.input}
        inputMode="numeric"
        leftIcon={{ type: "font-awesome", name: "chevron-left" }}
        label={"Total"}
      />

      <RenderTable
        receiptID={-1}
        items={receiptItems}
        setItems={setRecieptItems}
      />

      <Button onPress={() => onCreateReciept()}>Create Reciept</Button>
    </>
  );
}
