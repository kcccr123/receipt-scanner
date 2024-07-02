import { View, Text, StyleSheet, Button } from "react-native";

const activateCamera = () => {
  console.log("hello");
};

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Button title={"Scan Reciepts"} onPress={activateCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
