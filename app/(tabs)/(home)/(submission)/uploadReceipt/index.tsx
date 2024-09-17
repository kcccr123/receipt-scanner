import { View, Text } from "react-native";
import { Button } from "@rneui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { otherStyles } from "@/app/Other/main_styles";
import { buttonStyles } from "@/app/Other/main_styles";
import { detectImagePost } from "@/app/Other/requests";

export default function imageUploadPage() { 
  const router = useRouter();
  const { groupID } = useLocalSearchParams();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // update server models

    // after image is picked and value is obtained frm server, return to displayReceipt and add a new receipt with obtained info.
    if (!result.canceled) {
      //sayHello("hi");
      const response = await detectImagePost(result.assets[0].uri);

      if (response.data) {
        router.replace({
          pathname: "/displayReceipt", // The screen you want to navigate to
          params: {
            groupID: groupID,
            receiptData: JSON.stringify(response.data),
          },
        });
      } else {
        // error
      }
    }
    // use returned data to create reciepts page, and then use that to create reciept
  };
  return (
    <>
      <Button
        titleStyle={otherStyles.buttonLabel}
        buttonStyle={buttonStyles.Red}
        onPress={() => router.back()}
      >
        Back
      </Button>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Button onPress={pickImage} buttonStyle={buttonStyles.Blue}>
          <Text style={{ fontWeight: "bold", color: "white", fontSize: 26 }}>
            Select Image
          </Text>
        </Button>
      </View>
    </>
  );
}
