
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";

export default function imageUploadPage() {
  const router = useRouter();

  return (
    <>
      <Button onPress={() => router.back()}>Back</Button>
    </>
  );
}
