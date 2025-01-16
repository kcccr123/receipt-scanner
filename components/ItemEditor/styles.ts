import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  container: {
    backgroundColor: "#9b5353",
    borderRadius: 5,
  },
  save: {
    backgroundColor: "#28282B",
    borderRadius: 5,
  },
  edit_container: {
    marginVertical: 5,
  },
  item_edit: {
    backgroundColor: "#6abbbc",
    borderRadius: 20,
  },
  item_save: {
    backgroundColor: "#7ddcdd",
    borderRadius: 20,
  },
  item_delete: {
    backgroundColor: "#ffc0d1",
    borderRadius: 20,
  },
  add_item: {
    backgroundColor: "#6abbbc",
    borderColor: "white",
    borderRadius: 20,
  },
  add_item_container: {
    marginVertical: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  button_label: {
    fontWeight: "bold",
    fontFamily: "Product-Sans-Regular",
    fontSize: 18,
    color: "white",
  },
});

export const otherStyles = StyleSheet.create({
  inputLabel: {
    fontWeight: "bold",
    fontFamily: "Product-Sans-Regular",
    fontSize: 18,
    color: "dark grey",
  },
  buttonLabel: {
    fontWeight: "bold",
    fontFamily: "Product-Sans-Regular",
    fontSize: 18,
    color: "white",
  },
});
