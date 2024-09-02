
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function imageUploadPage() {
  const router = useRouter();



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
      detectImagePost(result.assets[0].uri);
    }
    // use returned data to create reciepts page, and then use that to create reciept 
  };
  return (
    <>
      <Button onPress={() => router.back()}>Back</Button>
      <Button onPress={pickImage}>Upload Image</Button>
    </>
  );
}
