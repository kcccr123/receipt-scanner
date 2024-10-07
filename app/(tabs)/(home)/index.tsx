import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { View, Text, StyleSheet, SectionList, Dimensions } from "react-native";
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
import React from "react";
import { addReceipt, getReceipts } from "@/app/database/receipts";
import { addItem } from "@/app/database/items";
import { Link, router } from "expo-router";
import { LineGraph } from "@/components/LineGraph";
import { format } from "date-fns";
import { buttonStyles } from "../main_styles";

const Home = () => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [date, setDate] = useState(new Date());
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

    if (groups.length == 0) {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Text style={{ fontSize: 20, paddingBottom: 15 }}>
            No Receipt groups found.
          </Text>
          <Text style={{ fontSize: 18 }}> Add one in the bottom right! </Text>
        </View>
      );
    }

    return (
      <>
        <SectionList
          contentContainerStyle={{
            justifyContent: "space-between",
          }}
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListItem.Swipeable
              rightContent={() => (
                <Button
                  onPress={() => deleteAction(item.id)}
                  icon={{ name: "delete", color: "white" }}
                  buttonStyle={{
                    minHeight: "100%",
                    backgroundColor: "#9b5353",
                  }}
                />
              )}
              bottomDivider
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between", // Space between the content and the button
                  width: "100%",
                }}
              >
                <ListItem.Content>
                  <ListItem.Title style={{fontWeight:"medium", fontSize:18, fontFamily:"monospace", fontStyle:"italic"}}>{item.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Content right>
                  <ListItem.Title style={{fontFamily:"monospace", fontWeight:"medium", fontSize:18, fontStyle:"italic"}}>{"$" + item.total}</ListItem.Title>
                </ListItem.Content>
                <Link
                  href={{
                    pathname: "/(displayGroup)",
                    params: { groupID: item.id, createGroup: "false" },
                  }}
                  asChild
                >
                  <Button
                    icon={{ name: "arrow-right-alt", color: "white" }}
                    buttonStyle={buttonStyles.Green}
                  />
                  {/* <ListItem.Chevron color="black" /> */}
                </Link>
              </View>
              <ListItem />
            </ListItem.Swipeable>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View
              style={{
                padding: 8,
                backgroundColor: "#6c8160",
                borderRadius: 15,
                marginHorizontal: 1,
              }}
            >
              <Text
                style={{
                  fontFamily:"monospace",
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 18,
                  marginHorizontal: 5,
                }}
              >
                {title}
              </Text>
            </View>
          )}
        />
      </>
    );
  };

  const groupByPurchaseDate = (items: GroupType[]) => {
    return items.reduce((result, item) => {
      const date = item.purchase_date
        ? item.purchase_date.toString()
        : undefined;
      if (date) {
        if (!result[date]) {
          result[date] = [];
        }
        result[date].push(item);
      } else {
        console.warn("Encountered item with undefined date:", item);
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
      purchase_date: format(new Date(), "yyyy-MM-dd"),
      upload_date: format(new Date(), "yyyy-MM-dd"),
    };

    const newGroupId = await addSingleGroup(db, newGroupInfo);
    router.replace({
      pathname: "/(displayGroup)",
      params: { groupID: newGroupId },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <LineGraph date={date} setDate={setDate} refreshOn={groups} />
      <GroupedTable groupedData={grouped_data} />
      <FAB
        visible={true}
        icon={{ name: "add", color: "white" }}
        color="#8BBF8A"
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
