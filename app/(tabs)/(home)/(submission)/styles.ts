import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#28282B",
    borderRadius: 20,
    width: 300,
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 40,
    color: "white",
  },
  back_button: { 
    backgroundColor: "#9b5353", 
    marginHorizontal: 20,
    width: 300, 
    borderRadius: 20 
  }
});
