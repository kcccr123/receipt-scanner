import { useEffect, useState } from "react";
import { ReceiptType } from "../../app/(tabs)/types";
import { ItemType } from "../ItemEditor/types";
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
import { RenderTable } from "../ItemEditor";

export const DisplayReceipt: React.FC<{
  isVisible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  receiptsList: ReceiptType[];
  setReceiptsList: React.Dispatch<React.SetStateAction<ReceiptType[]>>;
  ID: number | null;
  groupID: number;
}> = ({
  isVisible,
  setVisible,
  ID = null,
  groupID,
  receiptsList,
  setReceiptsList,
}) => {
  const defaultBase: ReceiptType = {
    id: 0,
    group_id: groupID,
    name: " ",
    total: 0,
  };
  const [name, setName] = useState(defaultBase.name);
  const [total, setTotal] = useState(defaultBase.total);
  const [itemsList, setItemsList] = useState<ItemType[]>([]);
  const [receiptID, setReceiptID] = useState(defaultBase.id);

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
          setName(defaultBase.name);
          setTotal(defaultBase.total);
          setItemsList([]);
          const newID = await addSingleReceipt(db, {
            name: name,
            id: 0,
            group_id: groupID,
            total: total,
          });
          setReceiptID(newID);
          const newr = await getSingleReceipt(db, newID);
          console.log(newr);
          if (newr != null) {
            receiptsList.push(newr);
            setReceiptsList(receiptsList);
          } else {
            console.log("new reciept not inited");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isVisible) {
      fetchData();
    }
  }, [ID, isVisible]);
  
  const toggleOverLay = () => {
    setVisible(!isVisible);
  };

  const update = (r: ReceiptType) => {
    const updatedData = receiptsList.map((item) =>
      item.id == r.id
        ? {
            ...item,
            name: r.name,
            total: r.total,
          }
        : item
    );
    setReceiptsList(updatedData);
  };

  const saveReceipt = async () => {
    const newReceipt: ReceiptType = {
      id: receiptID,
      group_id: groupID,
      name: name,
      total: total,
    };
    console.log(newReceipt);
    const db = await connectToDb();
    update(newReceipt);
    await updateReceipt(db, newReceipt);
    setName(defaultBase.name);
    setTotal(defaultBase.total);
    setReceiptsList([]);
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
      <Button
        title={"Save And Exit"}
        onPress={() => {
          saveReceipt();
          toggleOverLay();
        }}
      />
      <RenderTable
        setItems={setItemsList}
        items={itemsList}
        receiptID={receiptID}
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
