import { View, Text, StyleSheet, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { sayHello, detectImagePost } from "../requests";

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

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Button title={"Scan Reciepts"} onPress={pickImage} />
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
