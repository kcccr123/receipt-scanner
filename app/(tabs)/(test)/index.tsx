import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { runOnnxModel } from "../(camera)/utils";
import { sayHello, detectImagePost } from "../requests";
import { ListItem, Button, Icon, ListItemProps } from "@rneui/themed";

import React, { useState } from "react";

const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });
  if (!result.canceled) {
    // sayHello("hi");
    detectImagePost(result.assets[0].uri);
  }
};

interface ListItemData {
  id: number;
  label: string;
  price: string;
  iconname: string;
  icontype: string;
}

const dummy_reciept: ListItemData[] = [
  {
    id: 1,
    label: "Total",
    price: "0.00",
    iconname: "shopping-cart",
    icontype: "material",
  },
  {
    id: 2,
    label: "Item A",
    price: "0.00",
    iconname: "add-shopping-cart",
    icontype: "material",
  },
  {
    id: 3,
    label: "Item B",
    price: "0.00",
    iconname: "add-shopping-cart",
    icontype: "material",
  },
  {
    id: 9,
    label: "Item C",
    price: "0.00",
    iconname: "add-shopping-cart",
    icontype: "material",
  },
  {
    id: 4,
    label: "Item D",
    price: "0.00",
    iconname: "add-shopping-cart",
    icontype: "material",
  },
  {
    id: 6,
    label: "Item E",
    price: "0.00",
    iconname: "add-shopping-cart",
    icontype: "material",
  },
];

const RenderTable = () => {
  const [edit, setEdit] = useState(false);

  const [data, setData] = useState(dummy_reciept);
  const [itemID, setItemID] = useState<number | null>(null);
  const [itemName, setItemName] = useState(" ");
  const [itemPrice, setItemPrice] = useState("0.00");

  const editValues = (item: ListItemData) => {
    setItemID(item.id);
    setItemName(item.label);
    setItemPrice(item.price);
  };

  const update = (id: number) => {
    const updatedData = data.map((item) =>
      item.id == id ? { ...item, label: itemName, price: itemPrice } : item
    );
    setData(updatedData);
    setItemID(null);
  };

  const removeItem = (id: number) => {
    const updatedData = data.filter((item) => item.id !== id);

    //Reorder ids (might not need)
    const reorder = updatedData.map((item, index) => ({
      ...item,
      id: index + 1, //should reassign all ids starting from 1
    }));

    setData(reorder);
  };

  const addItem = () => {
    const newID =
      data.length > 0 ? Math.max(...data.map((item) => item.id)) : 0;

    const baseItem: ListItemData = {
      id: newID + 1,
      label: " ",
      price: " ",
      iconname: "add-shopping-cart",
      icontype: "material",
    };
    data.push(baseItem);

    setData(data);
    editValues(baseItem);
  };

  const renderVewOnlyItem = ({ item }: { item: ListItemData }) => (
    <ListItem bottomDivider>
      <Icon name={item.iconname} type={item.icontype} color="grey" />
      <ListItem.Content>
        {item.label == "Total" ? (
          <ListItem.Title style={{ fontWeight: "bold" }}>
            {item.label}
          </ListItem.Title>
        ) : (
          <ListItem.Title>{item.label}</ListItem.Title>
        )}
        <ListItem.Subtitle>{"$" + item.price}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  const renderEditableItem = ({ item }: { item: ListItemData }) => (
    <>
      {item.label !== "Total" ? (
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
          <Icon name={item.iconname} type={item.icontype} color="grey" />
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
                <ListItem.Title>{item.label}</ListItem.Title>
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
              buttonStyle={{ backgroundColor: "#32425f", borderRadius: 20 }}
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
              buttonStyle={{ backgroundColor: "#162812", borderRadius: 20 }}
              onPress={() => update(item.id)}
            />
          )}
        </ListItem.Swipeable>
      ) : (
        <ListItem bottomDivider>
          <Icon name={item.iconname} type={item.icontype} color="grey" />
          <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "bold" }}>
              {item.label}
            </ListItem.Title>
            {itemID == item.id ? (
              <TextInput
                style={styles.input}
                value={itemPrice}
                onChangeText={setItemPrice}
                placeholder="Edit Price"
                keyboardType="numeric"
              />
            ) : (
              <ListItem.Subtitle>{"$" + item.price}</ListItem.Subtitle>
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
              buttonStyle={{ backgroundColor: "#32425f", borderRadius: 20 }}
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
              buttonStyle={{ backgroundColor: "#162812", borderRadius: 20 }}
              onPress={() => update(item.id)}
            />
          )}
        </ListItem>
      )}
    </>
  );

  const renderViewOnlyList = () => {
    return (
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        keyExtractor={(item) => item.id.toString()}
        data={data}
        renderItem={renderVewOnlyItem}
      />
    );
  };

  const renderEditableList = () => {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {data.map((item) => (
          <View key={item.id}>{renderEditableItem({ item })}</View>
        ))}
        <Button
          onPress={() => {
            addItem();
          }}
          title="Add Item"
          buttonStyle={{
            backgroundColor: "black",
            borderWidth: 2,
            borderColor: "white",
            borderRadius: 15,
          }}
          containerStyle={{
            marginVertical: 10,
          }}
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
        title={edit ? "Save" : "Edit"}
        buttonStyle={{
          backgroundColor: "black",
          borderWidth: 2,
          borderColor: "white",
          borderRadius: 30,
        }}
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        titleStyle={{ fontWeight: "bold" }}
      />
      {edit ? renderEditableList() : renderViewOnlyList()}
    </KeyboardAvoidingView>
  );
};

export default function HomeTab() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <RenderTable />
    </KeyboardAvoidingView>
  );
}

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
