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
import { useRouter } from "expo-router";

export const LinkedGroupEditor: React.FC<{
  groupID: number | null;
}> = ({ groupID = null }) => {
  const router = useRouter();
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
      console.log("fetcing dataaaa");
      try {
        const db = await connectToDb();
        console.log("non empty groupid", groupID);
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
          console.log(groupID, "first branch");
          console.log(receipts, "non emptyu");
          setReceiptsList(receipts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    console.log(groupID);
    fetchData();
  }, [groupID]);

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

  const update = async (groupInfo: GroupType) => {
    const db = await connectToDb();
    updateGroup(db, groupInfo);
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
  };

  return (
    <>
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
        title={"Done"}
        onPress={() => {
          saveGroup();
          router.replace("(home)");
        }}
      />

      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={receiptsList}
        renderItem={renderreceiptsList}
      ></FlatList>
      <Link
        href={{
          pathname: "/(submission)",
          params: { groupID: gID },
        }}
        asChild
      >
        <Button
          title={"new receipt"}
          onPress={() => {
            saveGroup();
          }}
        />
      </Link>
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
