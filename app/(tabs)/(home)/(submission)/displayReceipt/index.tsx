import { Button } from "@rneui/themed";
import { useState, useEffect } from "react";
import { Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { connectToDb } from "@/app/database/db";

import { addSingleReceipt } from "@/app/database/receipts";
import { addItem } from "@/app/database/items";
import { RenderTable } from "@/components/ItemEditor";
import { receiptTableStyles } from "./styles";
import { buttonStyles, otherStyles } from "@/app/(tabs)/main_styles";
import { ProcessedReceipt } from "@/app/(tabs)/types";
import { ItemType } from "@/components/ItemEditor/types";
import React from "react";

export default function displayReceiptTablePage() {
  const router = useRouter();
  const { groupID, receiptData } = useLocalSearchParams();

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
  }, [groupID]);

  useEffect(() => {
    // parse new receipt here
    if (receiptData) {
      const parsedReceiptData = JSON.parse(
        receiptData as string
      ) as ProcessedReceipt;

      const newItems: ItemType[] = [];

      if (parsedReceiptData.items) {
        parsedReceiptData.items.map((item, index) => {
          const newItem: ItemType = {
            id: index,
            receipt_id: -1,
            name: item.name,
            price: Number(item.price),
          };
          newItems.push(newItem);
          setRecieptItems([...receiptItems, ...newItems]);
        });
      }
      if (parsedReceiptData.subtotal) {
        // TODO: Subtotal Logic
      }

      if (parsedReceiptData.total) {
        setReceiptTotal(Number(parsedReceiptData.total.price));
      }
      if (parsedReceiptData.store) {
        setReceiptName(parsedReceiptData.store);
      }
    }
  }, [receiptData]);

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
        inputStyle={{
          fontFamily: "Product-Sans-Regular",
          fontWeight: "bold",
          color: "black",
          fontSize: 16,
          marginHorizontal: 5,
        }}
        leftIcon={{
          type: "font-awesome",
          name: "chevron-left",
          color: "#6abbbc",
        }}
        label={"Name"}
        labelStyle={otherStyles.inputLabel}
        value={receiptName.toString()}
        onChangeText={(text) => setReceiptName(text)}
      />
      <Input
        style={receiptTableStyles.input}
        inputMode="numeric"
        inputStyle={{
          fontFamily: "Product-Sans-Regular",
          fontWeight: "bold",
          color: "black",
          fontSize: 16,
          marginHorizontal: 5,
        }}
        leftIcon={{
          type: "font-awesome",
          name: "chevron-left",
          color: "#6abbbc",
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
        buttonStyle={{ backgroundColor: "#7ddcdd", borderRadius: 20 }}
        titleStyle={otherStyles.buttonLabel}
        onPress={() => onCreateReciept()}
      >
        Create Reciept
      </Button>
    </>
  );
}

// old parsing logic for inhouse pipeline
// parse receiptData here
/*
    console.log("PARSING HERE");
    if (receiptData) {
      const parsedReceiptData = JSON.parse(
        receiptData as string
      ) as ProcessedReceipt;
      const newItems: ItemType[] = [];
      Object.keys(parsedReceiptData).map((key, index) => {
        // using the key process the receipt
        if (parsedReceiptData[key].name === "##TOTAL") {
          setReceiptTotal(Number(parsedReceiptData[key].price));
        } else if (parsedReceiptData[key].name === "##SUBTOTAL") {
          // TODO: Subtotal logic
        } else {
          const newItem: ItemType = {
            id: index,
            receipt_id: -1,
            name: parsedReceiptData[key].name,
            price: Number(parsedReceiptData[key].price),
          };
          newItems.push(newItem);
          setRecieptItems([...receiptItems, ...newItems]);
        }
      });
      console.log(parsedReceiptData);
      console.log(newItems);
    }*/
