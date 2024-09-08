import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { ListItem, Button, Icon } from "@rneui/themed";
import React, { useState } from "react";
import { ItemType } from "./types";
import { connectToDb } from "@/app/database/db";
import {
  addItem,
  addSingleItem,
  deleteItem,
  updateItem,
} from "@/app/database/items";
import { buttonStyles, otherStyles } from "./styles";

// TODO
// 1. Edit/Save button has no effect on acutallying doing anything?
// 2. were updating database every time we add or remove item
// 3. why connect to db every single function call instead of just defining a reusable variable for it?

export const RenderTable: React.FC<{
  setItems: React.Dispatch<React.SetStateAction<ItemType[]>>;
  items: ItemType[];
  receiptID: number;
}> = ({ setItems, items, receiptID }) => {
  const [edit, setEdit] = useState(false);
  const [itemID, setItemID] = useState<number | null>(null);
  const [itemName, setItemName] = useState(" ");
  const [itemPrice, setItemPrice] = useState("0.00");

  const editValues = (item: ItemType) => {
    setItemID(item.id);
    setItemName(item.name);
    setItemPrice(item.price.toString());
  };

  const update = async (id: number) => {
    const numericValue = parseFloat(itemPrice);
    const price = isNaN(numericValue) ? 0 : numericValue;
    const updatedData = items.map((item) =>
      item.id == id ? { ...item, name: itemName, price: price } : item
    );
    const db = await connectToDb();
    updateItem(db, {
      id: id,
      name: itemName,
      price: price,
      receipt_id: receiptID,
    });
    setItems(updatedData);
    setItemID(null);
  };

  const removeItem = async (id: number) => {
    const updatedData = items.filter((item) => item.id !== id);
    const db = await connectToDb();
    deleteItem(db, id);
    setItems(updatedData);
  };

  const add = async () => {
    const db = await connectToDb();
    const baseItem: ItemType = {
      id: 0,
      receipt_id: receiptID,
      name: " ",
      price: 0,
    };
    const newID = await addSingleItem(db, baseItem);
    console.log(newID);
    baseItem.id = newID;
    setItems([...items, baseItem]);
    editValues(baseItem);
  };

  const renderVewOnlyItem = ({ item }: { item: ItemType }) => (
    <ListItem bottomDivider>
      <Icon name={"add-shopping-cart"} type={"material"} color="grey" />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{"$" + item.price}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  const renderEditableItem = ({ item }: { item: ItemType }) => (
    <ListItem.Swipeable
      rightContent={() => (
        <Button
          onPress={() => {
            removeItem(item.id);
          }}
          icon={{ name: "remove-shopping-cart", color: "white" }}
          buttonStyle={{ minHeight: "100%", backgroundColor: "#a67f78" }}
        />
      )}
      bottomDivider
    >
      <Icon name={"add-shopping-cart"} type={"material"} color="grey" />
      <ListItem.Content>
        {itemID == item.id ? (
          <>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder="Edit Name"
            />
            <TextInput
              style={styles.input}
              value={itemPrice}
              onChangeText={setItemPrice}
              placeholder="Edit Price"
              keyboardType="numeric"
            />
          </>
        ) : (
          <>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>{"$" + item.price}</ListItem.Subtitle>
          </>
        )}
      </ListItem.Content>
      {itemID != item.id ? (
        <Button
          icon={{
            name: "edit",
            type: "material",
            size: 20,
            color: "white",
          }}
          buttonStyle={buttonStyles.item_edit}
          onPress={() => editValues(item)}
        />
      ) : (
        <Button
          icon={{
            name: "done-outline",
            type: "material",
            size: 20,
            color: "white",
          }}
          buttonStyle={buttonStyles.item_save}
          onPress={() => update(item.id)}
        />
      )}
      <Button
        icon={{
          name: "delete",
          type: "material",
          size: 20,
          color: "white",
        }}
        buttonStyle={buttonStyles.item_delete}
        onPress={() => {
          removeItem(item.id);
        }}
      />
    </ListItem.Swipeable>
  );

  const renderViewOnlyList = () => {
    return (
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        keyExtractor={(item) => item.id.toString()}
        data={items}
        renderItem={renderVewOnlyItem}
      />
    );
  };

  const renderEditableList = () => {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {items.map((item) => (
          <View key={item.id}>{renderEditableItem({ item })}</View>
        ))}
        <Button
          onPress={() => {
            add();
          }}
          title="Add Item"
          buttonStyle={buttonStyles.add_item}
          containerStyle={buttonStyles.add_item_container}
        />
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={115} //aadjust as needed
    >
      <Button
        onPress={() => {
          setEdit(!edit);
        }}
        title={edit ? "Save Items" : "Edit Items"}
        buttonStyle={{
          backgroundColor: edit ? "#6c7869" : "#65657e",
          borderWidth: 2,
          borderColor: "white",
          borderRadius: 20,
        }}
        containerStyle={buttonStyles.edit_container}
        titleStyle={otherStyles.buttonLabel}
      />
      {edit ? renderEditableList() : renderViewOnlyList()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    justifyContent: "center",
    marginTop: 20,
    borderTopWidth: 1,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
});
