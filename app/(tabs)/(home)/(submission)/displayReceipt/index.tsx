import { Button } from "@rneui/themed";
import { useState, useEffect } from "react";
import { ItemType } from "@/components/ItemEditor/types";
import { Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { connectToDb } from "@/app/database/db";

import { addSingleReceipt } from "@/app/database/receipts";
import { addItem } from "@/app/database/items";
import { RenderTable } from "@/components/ItemEditor";
import { receiptTableStyles } from "./styles";
import { buttonStyles, otherStyles } from "@/app/(tabs)/main_styles";


export default function displayReceiptTablePage() {
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
      id: 0,
      group_id: currentGroupId,
      name: receiptName,
      total: receiptTotal,
    };

    const receiptId = await addSingleReceipt(db, receiptInfo);
    const itemsToAdd = JSON.parse(JSON.stringify(receiptItems));

    for (let i = 0; i < itemsToAdd.length; i++) {
      itemsToAdd[i].receipt_id = receiptId;
    }
    await addItem(db, itemsToAdd);
    console.log("added items", itemsToAdd);

    console.log("end");
    router.replace({
      pathname: "/(displayGroup)", // The screen you want to navigate to
      params: {
        groupID: currentGroupId,
      },
    });
    setRecieptItems([]);
  };

  return (
    <>
      <Button
        buttonStyle={buttonStyles.Red}
        titleStyle={otherStyles.buttonLabel}
        onPress={() => router.back()}
      >
        Back
      </Button>

      <Input
        style={receiptTableStyles.input}
        leftIcon={{
          type: "font-awesome",
          name: "chevron-left",
          color: "#dfc6af",
        }}
        label={"Name"}
        labelStyle={otherStyles.inputLabel}
        value={receiptName.toString()}
        onChangeText={(text) => setReceiptName(text)}
      />
      <Input
        style={receiptTableStyles.input}
        inputMode="numeric"
        leftIcon={{
          type: "font-awesome",
          name: "chevron-left",
          color: "#dfc6af",
        }}
        label={"Total"}
        labelStyle={otherStyles.inputLabel}
        value={receiptTotal.toString()}
        onChangeText={(text) => {
          const numericValue = parseInt(text);
          setReceiptTotal(isNaN(numericValue) ? 0 : numericValue);
        }}
      />

      <RenderTable
        receiptID={-1}
        items={receiptItems}
        setItems={setRecieptItems}
      />

      <Button
        buttonStyle={buttonStyles.Green}
        titleStyle={otherStyles.buttonLabel}
        onPress={() => onCreateReciept()}
      >
        Create Reciept
      </Button>
    </>
  );
}
