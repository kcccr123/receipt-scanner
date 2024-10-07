import { connectToDb } from "@/app/database/db";
import {
  addGroup,
  addSingleGroup,
  getSingleGroup,
  updateGroup,
} from "@/app/database/groups";
import { useEffect, useState } from "react";
import { GroupType, ReceiptType } from "../../app/(tabs)/types";
import { deleteReceipt, getReceipts } from "@/app/database/receipts";
import { Button, Icon, Input, ListItem, Overlay } from "@rneui/themed";
import { FlatList, StyleSheet } from "react-native";
import { DisplayReceipt } from "../ReceiptEditor";
import { Link } from "expo-router";
import React from "react";
export const DisplayGroup: React.FC<{
  isVisible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setGroup: React.Dispatch<React.SetStateAction<GroupType[]>>;
  group: GroupType[];
  groupID: number | null;
}> = ({ isVisible, setVisible, groupID = null, group, setGroup }) => {
  const defaultBase: GroupType = {
    id: 0,
    name: " ",
    total: 0,
    purchase_date: "9999-12-30",
    upload_date: "9999-12-30",
  };
  const [name, setName] = useState(defaultBase.name);
  const [pdate, setPdate] = useState(defaultBase.purchase_date);
  const [udate, setUdate] = useState(defaultBase.upload_date);
  const [total, setTotal] = useState(defaultBase.total);
  const [gID, setGID] = useState(defaultBase.id);
  const [itemOV, setItemOV] = useState(false);
  const [receiptID, setReceiptID] = useState(0);
  const [receiptsList, setReceiptsList] = useState<ReceiptType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await connectToDb();
        if (groupID != null) {
          setGID(groupID);
          const base = await getSingleGroup(db, groupID);
          if (base != null) {
            setName(base.name);
            setPdate(base.purchase_date.toString());
            setUdate(base.upload_date.toString());
            setTotal(base.total);
          }
          const receipts = await getReceipts(db, groupID);
          setReceiptsList(receipts);
        } else {
          setName(defaultBase.name);
          setPdate(defaultBase.purchase_date);
          setUdate(defaultBase.upload_date);
          setTotal(defaultBase.total);
          const newID = await addSingleGroup(db, {
            id: 0,
            name: name,
            total: total,
            upload_date: udate,
            purchase_date: pdate,
          });
          setGID(newID);
          const newg = await getSingleGroup(db, newID);
          console.log(newg);
          if (newg != null) {
            group.push(newg);
            setGroup(group);
          } else {
            console.log("new group not inited");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isVisible) {
      fetchData();
    }
  }, [isVisible, groupID]);

  const toggleOverLay = () => {
    setVisible(!isVisible);
  };

  const remove = async (id: number) => {
    try {
      const db = await connectToDb();
      deleteReceipt(db, id);

      const newList = receiptsList.filter((item) => item.id != id);
      setReceiptsList(newList);
    } catch (error) {
      console.error("Failed to delete Receipt:", error);
    }
  };

  const update = (g: GroupType) => {
    const updatedData = group.map((item) =>
      item.id == g.id
        ? {
            ...item,
            name: g.name,
            total: g.total,
            upload_date: g.upload_date,
            purchase_date: g.purchase_date,
          }
        : item
    );
    setGroup(updatedData);
  };

  const renderreceiptsList = ({ item }: { item: ReceiptType }) => (
    <ListItem bottomDivider>
      <Icon name={"receipt"} type={"material"} color="grey" />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Content right>
        <ListItem.Title>{"$" + item.total}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron
        color="black"
        onPress={() => {
          setItemOV(true);
          setReceiptID(item.id);
        }}
      />
      <Button
        icon={{
          name: "delete",
          type: "material",
          size: 20,
          color: "white",
        }}
        buttonStyle={{ backgroundColor: "#a67f78", borderRadius: 20 }}
        onPress={() => {
          remove(item.id);
        }}
      />
    </ListItem>
  );

  const saveGroup = async () => {
    const newGroup: GroupType = {
      id: gID,
      name: name,
      total: total,
      upload_date: udate,
      purchase_date: pdate,
    };
    console.log(newGroup);
    const db = await connectToDb();
    await updateGroup(db, newGroup);
    update(newGroup);
    setName(defaultBase.name);
    setPdate(defaultBase.purchase_date);
    setUdate(defaultBase.upload_date);
    setTotal(defaultBase.total);
  };

  return (
    <>
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
        <Input
          style={styles.input}
          value={pdate.toString()}
          onChangeText={setPdate}
          leftIcon={{ type: "font-awesome", name: "chevron-left" }}
          label={"Purchase Date"}
        />
        <Input
          style={styles.input}
          value={udate.toString()}
          onChangeText={setUdate}
          leftIcon={{ type: "font-awesome", name: "chevron-left" }}
          label={"Upload Date"}
        />

        <Button
          title={"Save And Exit"}
          onPress={() => {
            saveGroup();
            toggleOverLay();
          }}
        />
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={receiptsList}
          renderItem={renderreceiptsList}
        ></FlatList>
        <Link
          href={{
            pathname: "(submission)",
            params: { id: gID },
          }}
          asChild
        >
          <Button
            title={"new receipt"}
            onPress={() => console.log("add a new receipt")}
          />
        </Link>
      </Overlay>
      <DisplayReceipt
        isVisible={itemOV}
        setVisible={setItemOV}
        receiptsList={receiptsList}
        setReceiptsList={setReceiptsList}
        groupID={gID}
        ID={receiptID}
      />
    </>
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
