import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  Red: {
    backgroundColor: "#9b5353",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  NewReceipt: {
    backgroundColor: "#28282B",
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  Green: {
    backgroundColor: "#6c7869",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  PopupButton: {
    backgroundColor: "#28282B",
    borderRadius: 20,
    height: 50,
    marginHorizontal: 5,
    marginVertical: 2,
  },
});

export const otherStyles = StyleSheet.create({
  inputLabel: {
    fontWeight: "bold",
    fontSize: 18,
    color: "dark grey",
  },
  buttonLabel: { fontWeight: "bold" },

  transparentOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0)", // Fully transparent background
    padding: 20,
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
  },
});
