import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { GroupedTableProps, GroupType } from "../types";
import { connectToDb, createTable, removeTable } from "@/app/database/db";
import {
  addGroup,
  deleteGroup,
  getGroups,
  addSingleGroup,
} from "@/app/database/groups";
import { ListItem, Button, FAB } from "@rneui/themed";
import { DisplayGroup } from "../../../components/GroupEditor";
import { SafeAreaView } from "react-native-safe-area-context";

import { addReceipt, getReceipts } from "@/app/database/receipts";
import { addItem } from "@/app/database/items";
import { Link, router } from "expo-router";

const Home = () => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  //for editing group

  const router = useRouter();

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

  useFocusEffect(
    useCallback(() => {
      loadDBCallback();
    }, [loadDBCallback])
  );

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
                buttonStyle={{ minHeight: "100%", backgroundColor: "#9b5353" }}
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
          <View style={{ padding: 10, backgroundColor: "black", borderRadius: 4 }}>
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 17, marginHorizontal: 145}}>
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

  const createNewGroup = async () => {
    const db = await connectToDb();

    const newGroupInfo: GroupType = {
      id: -1,
      name: " ",
      total: 0.0,
      purchase_date: "9999-12-30",
      upload_date: "9999-12-30",
    };

    const newGroupId = await addSingleGroup(db, newGroupInfo);
    router.replace({
      pathname: "/(displayGroup)",
      params: { groupID: newGroupId },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <GroupedTable groupedData={grouped_data} />
      <FAB
        visible={true}
        icon={{ name: "add", color: "white" }}
        color="#6c7869"
        onPress={createNewGroup}
        placement="right"
      />
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
