import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { GroupedTableProps, GroupType } from "../types";
import { connectToDb, createTable, removeTable } from "@/app/database/db";
import { addGroup, deleteGroup, getGroups } from "@/app/database/groups";
import { ListItem, Button, FAB } from "@rneui/themed";
import { DisplayGroup } from "../../../components/GroupEditor";
import { SafeAreaView } from "react-native-safe-area-context";

import { addReceipt, getReceipts } from "@/app/database/receipts";
import { addItem } from "@/app/database/items";
import { Link } from "expo-router";

/*
const dummyGroup = [
  {
    id: 0,
    name: "objA",
    total: 10,
    upload_date: "2003-04-27",
    purchase_date: "2005-03-22",
  },
  {
    id: 1,
    name: "objB",
    total: 23,
    upload_date: "2003-04-27",
    purchase_date: "2005-03-22",
  },
  {
    id: 2,
    name: "objC",
    total: 445,
    upload_date: "2003-04-27",
    purchase_date: "2005-03-22",
  },
  {
    id: 3,
    name: "objD",
    total: 56,
    upload_date: "2003-04-27",
    purchase_date: "2022-05-13",
  },
  {
    id: 4,
    name: "objE",
    total: 79,
    upload_date: "2003-04-27",
    purchase_date: "2024-03-22",
  },
  {
    id: 5,
    name: "objF",
    total: 888,
    upload_date: "2003-04-27",
    purchase_date: "2015-07-01",
  },
  {
    id: 6,
    name: "objG",
    total: 666,
    upload_date: "2003-04-27",
    purchase_date: "2018-11-13",
  },
];

const dummyReceipts = [
  { id: 0, group_id: 0, name: "Grocery Store", total: 45.32 },
  { id: 0, group_id: 1, name: "Pharmacy", total: 18.99 },
  { id: 0, group_id: 2, name: "Electronics", total: 120.75 },
  { id: 0, group_id: 3, name: "Clothing Store", total: 89.49 },
  { id: 0, group_id: 0, name: "Supermarket", total: 60.1 },
  { id: 0, group_id: 1, name: "Coffee Shop", total: 7.45 },
  { id: 0, group_id: 2, name: "Bookstore", total: 23.99 },
  { id: 0, group_id: 3, name: "Hardware Store", total: 54.2 },
  { id: 0, group_id: 0, name: "Gas Station", total: 30.0 },
  { id: 0, group_id: 1, name: "Bakery", total: 15.25 },
  { id: 0, group_id: 2, name: "Pet Store", total: 42.5 },
  { id: 0, group_id: 3, name: "Furniture Store", total: 200.75 },
  { id: 0, group_id: 0, name: "Cinema", total: 25.0 },
  { id: 0, group_id: 1, name: "Toy Store", total: 35.8 },
  { id: 0, group_id: 2, name: "Fast Food", total: 12.99 },
];
const dummyItems = [
  { id: 1, receipt_id: 0, name: "Item A", price: 10.99 },
  { id: 2, receipt_id: 1, name: "Item B", price: 5.49 },
  { id: 3, receipt_id: 2, name: "Item C", price: 15.0 },
  { id: 4, receipt_id: 3, name: "Item D", price: 7.89 },
  { id: 5, receipt_id: 4, name: "Item E", price: 12.75 },
  { id: 6, receipt_id: 5, name: "Item F", price: 9.99 },
  { id: 7, receipt_id: 0, name: "Item G", price: 20.0 },
  { id: 8, receipt_id: 1, name: "Item H", price: 3.49 },
  { id: 9, receipt_id: 2, name: "Item I", price: 11.25 },
  { id: 10, receipt_id: 3, name: "Item J", price: 6.5 },
  { id: 11, receipt_id: 4, name: "Item K", price: 13.99 },
  { id: 12, receipt_id: 5, name: "Item L", price: 8.49 },
  { id: 13, receipt_id: 0, name: "Item M", price: 19.99 },
  { id: 14, receipt_id: 1, name: "Item N", price: 2.75 },
  { id: 15, receipt_id: 2, name: "Item O", price: 14.5 },
  { id: 16, receipt_id: 3, name: "Item P", price: 7.25 },
  { id: 17, receipt_id: 4, name: "Item Q", price: 10.0 },
  { id: 18, receipt_id: 5, name: "Item R", price: 5.75 },
  { id: 19, receipt_id: 0, name: "Item S", price: 21.5 },
  { id: 20, receipt_id: 1, name: "Item T", price: 4.49 },
  { id: 21, receipt_id: 2, name: "Item U", price: 16.75 },
  { id: 22, receipt_id: 3, name: "Item V", price: 6.99 },
  { id: 23, receipt_id: 4, name: "Item W", price: 12.0 },
  { id: 24, receipt_id: 5, name: "Item X", price: 8.99 },
  { id: 25, receipt_id: 0, name: "Item Y", price: 18.0 },
  { id: 26, receipt_id: 1, name: "Item Z", price: 3.99 },
  { id: 27, receipt_id: 2, name: "Item AA", price: 11.0 },
  { id: 28, receipt_id: 3, name: "Item BB", price: 7.0 },
  { id: 29, receipt_id: 4, name: "Item CC", price: 13.5 },
  { id: 30, receipt_id: 5, name: "Item DD", price: 9.25 },
];*/

const Home = () => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  //for editing group
  const [groupOV, setGroupOV] = useState(false);

  const loadDBCallback = useCallback(async () => {
    try {
      const db = await connectToDb();

      // removeTable(db, "Groups");
      // removeTable(db, "Items");
      // removeTable(db, "Receipts");

      await createTable(db);
      const storedData = await getGroups(db);
      if (storedData && storedData.length) {
        setGroups(storedData);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDBCallback();
  }, [loadDBCallback]);

  //sort by purchase date
  const sortedGroups = groups.sort((a, b) => {
    const dateA = new Date(a.purchase_date).getTime();
    const dateB = new Date(b.purchase_date).getTime();
    return dateB - dateA;
  });

  const deleteAction = async (id: number) => {
    try {
      const db = await connectToDb();
      deleteGroup(db, id);

      const newGroups = groups.filter((group) => group.id != id);
      setGroups(newGroups);
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  const GroupedTable = ({ groupedData }: GroupedTableProps) => {
    const sections = Object.keys(groupedData).map((date) => ({
      title: date,
      data: groupedData[date],
    }));

    return (
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem.Swipeable
            rightContent={() => (
              <Button
                onPress={() => deleteAction(item.id)}
                icon={{ name: "delete", color: "white" }}
                buttonStyle={{ minHeight: "100%", backgroundColor: "#a67f78" }}
              />
            )}
            bottomDivider
          >
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content right>
              <ListItem.Title>{"$" + item.total}</ListItem.Title>
            </ListItem.Content>
            <Link
              href={{
                pathname: "/(displayGroup)",
                params: { groupID: item.id, createGroup: "false" },
              }}
              asChild
            >
              <ListItem.Chevron color="black" />
            </Link>
            <ListItem />
          </ListItem.Swipeable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={{ padding: 10, backgroundColor: "#32425f" }}>
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 17 }}>
              {title}
            </Text>
          </View>
        )}
      />
    );
  };

  const groupByPurchaseDate = (items: GroupType[]) => {
    return items.reduce((result, item) => {
      const date = item.purchase_date
        ? item.purchase_date.toString()
        : undefined; // Ensure date is treated as a string
      if (date) {
        if (!result[date]) {
          result[date] = [];
        }
        result[date].push(item);
      } else {
        console.warn("Encountered item with undefined date:", item);
        // Handle cases where the date is undefined, if necessary
      }
      return result;
    }, {} as { [key: string]: GroupType[] });
  };
  const grouped_data = groupByPurchaseDate(sortedGroups);
  /*
  <DisplayGroup
  isVisible={groupOV}
  setVisible={setGroupOV}
  groupID={groupID}
  group={groups}
  setGroup={setGroups}
/>
*/
  return (
    <View style={{ flex: 1 }}>
      <GroupedTable groupedData={grouped_data} />

      <Link
        href={{
          pathname: "/(displayGroup)",
          params: { groupID: null, createGroup: "true" },
        }}
        asChild
      >
        <FAB
          visible={true}
          icon={{ name: "add", color: "white" }}
          color="black"
          placement="right"
        />
      </Link>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
