import { connectToDb } from "@/app/database/db";
import {
  addGroup,
  addSingleGroup,
  getSingleGroup,
  updateGroup,
} from "@/app/database/groups";
import { useEffect, useState } from "react";
import { GroupType, ReceiptType } from "../types";
import { getReceipts } from "@/app/database/receipts";
import { Button, Icon, Input, ListItem, Overlay } from "@rneui/themed";
import { FlatList, StyleSheet } from "react-native";
import { DisplayReceipt } from "./receiptOV";

export const DisplayGroup: React.FC<{
  isVisible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setGroup: React.Dispatch<React.SetStateAction<GroupType[]>>;
  group: GroupType[];
  groupID: number | null;
}> = ({
  isVisible,
  setVisible,
  groupID = null,
  group,
  setGroup,
}) => {
  const [name, setName] = useState(" ");
  const [pdate, setPdate] = useState("YYYY-MM-DD");
  const [udate, setUdate] = useState("YYYY-MM-DD");
  const [total, setTotal] = useState(0);
  const [gID, setGID] = useState(0);
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
          const newID = await addSingleGroup(db, {
            id: 0,
            name: name,
            total: 0,
            upload_date: "2000-01-01",
            purchase_date: "2000-01-01",
          });
          setGID(newID);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (groupID !== null) {
      fetchData();
    }
  }, [groupID]);

  const toggleOverLay = () => {
    setVisible(!isVisible);
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

  const add = (g: GroupType) => {
    g.id = gID;
    group.push(g);
    setGroup(group);
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
      <ListItem.Chevron color="black" onPress={() => {setItemOV(true); setReceiptID(item.id)}} />
    </ListItem>
  );

  const saveGroup = async () => {
    const newGroup: GroupType = {
      id: 0,
      name: name,
      total: total,
      upload_date: udate,
      purchase_date: pdate,
    };
    console.log(newGroup);
    const db = await connectToDb();
    if (groupID != null) {
      newGroup.id = groupID;
      await updateGroup(db, newGroup);
      update(newGroup);
    } else {
      add(newGroup);
    }
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
          value={pdate}
          onChangeText={setPdate}
          leftIcon={{ type: "font-awesome", name: "chevron-left" }}
          label={"Purchase Date"}
        />
        <Input
          style={styles.input}
          value={udate}
          onChangeText={setUdate}
          leftIcon={{ type: "font-awesome", name: "chevron-left" }}
          label={"Upload Date"}
        />
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={receiptsList}
          renderItem={renderreceiptsList}
        ></FlatList>
        <Button
          title={"new receipt"}
          onPress={() => console.log("add a new receipt")}
        />
        <Button
          title={"save"}
          onPress={() => {
            saveGroup();
            toggleOverLay();
          }}
        />
      </Overlay>
      <DisplayReceipt isVisible={itemOV} setVisible={setItemOV} groupID={gID} ID={receiptID}/>
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
