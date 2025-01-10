import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  Red: {
    backgroundColor: "#9b5353",
    borderRadius: 20,
    marginHorizontal:5,
  },
  blue_d: { 
    backgroundColor: "#64b0b1", 
    borderRadius: 20,
  },
  blue_m: {
    backgroundColor: "#77d1d2",
    // borderRadius: 20,
    marginHorizontal:5,
  },
  blue_l: {
    backgroundColor: "#77ddcdd",
    borderRadius: 20,
    marginHorizontal:5,
  },
  white:{
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal:5,
  },
});

export const otherStyles = StyleSheet.create({
  inputLabel: {
    fontWeight: "bold",
    fontSize: 18,
    color: "dark grey",
  },
  buttonLabel: { fontWeight: "bold" },
});
