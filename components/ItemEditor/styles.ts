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
    width: 150,
    marginHorizontal: 119,
    marginVertical: 5,
  },
  item_edit: {
    backgroundColor: "#28282B",
    borderRadius: 20,
  },
  item_save: {
    backgroundColor: "#6c7869",
    borderRadius: 20,
  },
  item_delete: {
    backgroundColor: "#9b5353",
    borderRadius: 20,
  },
  add_item: {
    backgroundColor: "#28282B",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20,
  },
  add_item_container: {
    marginVertical: 10,
    width: 200,
    marginHorizontal: 96,
    alignContent: "center",
    justifyContent: "center",
  },
  button_label: { fontWeight: "bold" },
});

export const otherStyles = StyleSheet.create({
  inputLabel: {
    fontWeight: "bold",
    fontSize: 18,
    color: "dark grey",
  },
  buttonLabel: { fontWeight: "bold" },
});
