import { useEffect, useState } from "react";
import { ItemType, ReceiptType } from "../types";
import { connectToDb } from "@/app/database/db";
import {
  addReceipt,
  addSingleReceipt,
  getSingleReceipt,
  updateReceipt,
} from "@/app/database/receipts";
import { getItems } from "@/app/database/items";
import { Button, Input, Overlay } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { RenderTable } from "./itemDisplay";

export const DisplayReceipt: React.FC<{
  isVisible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  ID: number | null;
  groupID: number;
}> = ({ isVisible, setVisible, ID = null, groupID }) => {
  const [name, setName] = useState(" ");
  const [total, setTotal] = useState(0);
  const [itemsList, setItemsList] = useState<ItemType[]>([]);
  const [receiptID, setReceiptID] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await connectToDb();
        if (ID != null) {
          setReceiptID(ID);
          const base = await getSingleReceipt(db, ID);
          if (base != null) {
            setName(base.name);
            setTotal(base.total);
          }
          const items = await getItems(db, ID);
          setItemsList(items);
        } else {
          const newID = await addSingleReceipt(db, {
            name: name,
            id: 0,
            group_id: groupID,
            total: total,
          });
          setReceiptID(newID);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (ID !== null) {
      fetchData();
    }
  }, [ID]);

  const toggleOverLay = () => {
    setVisible(!isVisible);
  };

  const saveReceipt = async () => {
    const newReceipt: ReceiptType = {
      id: 0,
      group_id: groupID,
      name: name,
      total: total,
    };
    console.log(newReceipt);
    const db = await connectToDb();
    if (ID != null) {
      newReceipt.id = ID;
      await updateReceipt(db, newReceipt);
    } else {
      await addReceipt(db, [newReceipt]);
    }
  };

  return (
    <Overlay isVisible={isVisible} fullScreen={true}>
      <Button title={"cancel"} onPress={toggleOverLay} />
      <Input
        style={styles.input}
        value={name}
        onChangeText={setName}
        leftIcon={{ type: "font-awesome", name: "chevron-left" }}
        label={"name"}
      />
      <Input
        style={styles.input}
        value={total.toString()}
        inputMode="numeric"
        onChangeText={(value) => {
          const numericValue = parseFloat(value);
          setTotal(isNaN(numericValue) ? 0 : numericValue);
        }}
        leftIcon={{ type: "font-awesome", name: "chevron-left" }}
        label={"Total"}
      />
      <RenderTable setItems={setItemsList} items={itemsList} receiptID={receiptID} />
      <Button
        title={"save"}
        onPress={() => {
          saveReceipt();
          toggleOverLay();
        }}
      />
    </Overlay>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
});
