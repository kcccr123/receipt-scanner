import { connectToDb } from "@/app/database/db";
import { getSingleGroup, updateGroup } from "@/app/database/groups";
import { DatePickerModal } from "react-native-paper-dates";
import { SetStateAction, useState } from "react";
import { useCallback } from "react";
import { GroupType, ReceiptType } from "../../app/(tabs)/types";
import { deleteReceipt, getReceipts } from "@/app/database/receipts";
import {
  BottomSheet,
  Button,
  Icon,
  Input,
  ListItem,
  Overlay,
} from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { FlatList, StyleSheet } from "react-native";
import { DisplayReceipt } from "../ReceiptEditor";
import { Link, useFocusEffect } from "expo-router";
import { useRouter } from "expo-router";
import { buttonStyles, otherStyles } from "./styles";
import { format } from "date-fns";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { View, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import { registerTranslation, enGB } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { detectImagePost } from "@/app/(tabs)/requests";
import { ActivityIndicator } from "react-native-paper";
import React from "react";
registerTranslation("en", enGB);

export const LinkedGroupEditor: React.FC<{
  groupID: number | null;
  receiptsList: ReceiptType[];
  setReceiptsList: React.Dispatch<React.SetStateAction<ReceiptType[]>>;
}> = ({ groupID = null }) => {
  const router = useRouter();
  const defaultBase: GroupType = {
    id: 0,
    name: " ",
    total: 0,
    purchase_date: "9999-12-30",
    upload_date: "9999-12-30",
  };
  const [name, setName] = useState(defaultBase.name);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [pdate, setPdate] = useState<CalendarDate>(new Date());
  const [udate, setUdate] = useState<CalendarDate>(new Date());

  const [total, setTotal] = useState(defaultBase.total);
  const [gID, setGID] = useState(defaultBase.id);
  const [itemOV, setItemOV] = useState(false);
  const [receiptID, setReceiptID] = useState(0);
  const [receiptsList, setReceiptsList] = useState<ReceiptType[]>([]);
  const [popup, setPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        console.log("Fetching data...");
        try {
          const db = await connectToDb();
          console.log("non empty groupID", groupID);
          if (groupID != null) {
            setGID(groupID);
            const base = await getSingleGroup(db, groupID);
            if (base != null) {
              setName(base.name);
              setPdate(new Date());
              setUdate(new Date());
              setTotal(base.total);
            }
            const receipts = await getReceipts(db, groupID);
            setReceiptsList(receipts);
          }
        } catch (error) {
          console.error(error);
        }
      };

      console.log(groupID);
      fetchData();

      // Optional: Cleanup function
      return () => {
        // Cleanup logic if needed
      };
    }, [groupID]) // Dependencies array
  );

  const remove = async (id: number) => {
    try {
      const db = await connectToDb();
      deleteReceipt(db, id);

      const newList = receiptsList.filter((item) => item.id != id);
      setReceiptsList(newList);
    } catch (error) {
      console.error("Failed to delete Receipt:", error);
    }
  };

  const renderreceiptsList = ({ item }: { item: ReceiptType }) => (
    <ListItem bottomDivider>
      <Icon name={"receipt"} type={"material"} color="#dfc6af" />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Content right>
        <ListItem.Title>{"$" + item.total}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron
        color="black"
        onPress={() => {
          setItemOV(true);
          setReceiptID(item.id);
        }}
      />
      <Button
        icon={{
          name: "delete",
          type: "material",
          size: 20,
          color: "white",
        }}
        buttonStyle={{ backgroundColor: "#9b5353", borderRadius: 20 }}
        onPress={() => {
          remove(item.id);
        }}
      />
    </ListItem>
  );

  const saveGroup = async () => {
    const newGroup: GroupType = {
      id: gID,
      name: name,
      total: total,
      upload_date: format(udate as Date, "yyyy-MM-dd"),
      purchase_date: format(pdate as Date, "yyyy-MM-dd"),
    };
    console.log(newGroup);
    const db = await connectToDb();
    await updateGroup(db, newGroup);
  };

  const onDismissSingle = useCallback(() => {
    setDatePickerOpen(false);
  }, [datePickerOpen]);

  const onConfirmSingle = useCallback(
    (params: { date: SetStateAction<CalendarDate> }) => {
      console.log(params);
      setDatePickerOpen(false);
      setPdate(params.date);
    },
    [setDatePickerOpen, setPdate]
  );

  const theme = {
    colors: {
      primary: "#dfc6af",
      background: "#ffffff",
      surface: "#ffffff",
      accent: "#dfc6af",
      text: "#000000",
      disabled: "rgba(0, 0, 0, 0.38)",
      placeholder: "#aaaaaa",
    },
    roundness: 10,
  };

  const renderReceiptsInGroup = () => {
    if (receiptsList.length == 0) {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text style={{ fontSize: 20, paddingBottom: 15 }}>
            No Receipts found.
          </Text>
        </View>
      );
    } else {
      return (
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={receiptsList}
          renderItem={renderreceiptsList}
        />
      );
    }
  };

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
      setIsLoading(true);
      const response = await detectImagePost(result.assets[0].uri);
      console.log(response, "receipt");
      setIsLoading(false);

      if (response.data) {
        router.replace({
          pathname: "/displayReceipt", // The screen you want to navigate to
          params: {
            groupID: gID,
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
      <PaperProvider theme={theme}>
        <Overlay
          isVisible={isLoading}
          overlayStyle={otherStyles.transparentOverlay} // Transparent overlay with no border
        >
          <ActivityIndicator size="large" animating={true} />
        </Overlay>
        <Input
          style={styles.input}
          value={name}
          onChangeText={setName}
          leftIcon={{
            type: "font-awesome",
            name: "chevron-left",
            color: "#dfc6af",
          }}
          label={"Name"}
          labelStyle={otherStyles.inputLabel}
        />
        <Input
          style={styles.input}
          value={total.toString()}
          inputMode="numeric"
          onChangeText={(value) => {
            const numericValue = parseFloat(value);
            setTotal(isNaN(numericValue) ? 0 : numericValue);
          }}
          leftIcon={{
            type: "font-awesome",
            name: "chevron-left",
            color: "#dfc6af",
          }}
          label={"Total"}
          labelStyle={otherStyles.inputLabel}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Input
            label="Date"
            style={styles.dateInput}
            disabled={true}
            value={format(pdate as Date, "yyyy-MM-dd")}
            leftIcon={{
              type: "font-awesome",
              name: "chevron-left",
              color: "#dfc6af",
            }}
            inputStyle={{ fontWeight: "bold", color: "black" }}
            labelStyle={otherStyles.inputLabel}
            containerStyle={{ flex: 1 }}
          />
          <Button
            buttonStyle={{
              backgroundColor: "#dfc6af",
              borderRadius: 20,
              width: "100%",
            }}
            title={"Select"}
            containerStyle={{ flex: 1, marginLeft: 10, marginRight: 10 }}
            titleStyle={{ color: "black" }}
            onPress={() => setDatePickerOpen(true)}
          />
        </View>
        <DatePickerModal
          locale="en"
          mode="single"
          label={"Select Date"}
          visible={datePickerOpen}
          onDismiss={onDismissSingle}
          date={pdate}
          onConfirm={onConfirmSingle}
          presentationStyle="overFullScreen"
        />

        <Button
          title={"Done"}
          buttonStyle={buttonStyles.Green}
          onPress={() => {
            saveGroup();
            router.replace("(home)");
          }}
        />
        <Button
          title={"new receipt"}
          buttonStyle={buttonStyles.NewReceipt}
          onPress={() => {
            saveGroup();
            setPopup(true);
          }}
        />

        {renderReceiptsInGroup()}
        <SafeAreaProvider>
          <BottomSheet
            modalProps={{}}
            isVisible={popup}
            onBackdropPress={() => setPopup(false)}
          >
            {/* <Button buttonStyle={buttonStyles.PopupButton} title={"Back"} onPress={()=>setPopup(false)}/> */}
            <Link
              href={{
                pathname: "/(submission)/displayReceipt",
                params: { groupID: gID },
              }}
              asChild
            >
              <Button
                title={"Blank Table"}
                onPress={() => setPopup(false)}
                buttonStyle={buttonStyles.PopupButton}
              />
            </Link>

            <Link
              href={{
                pathname: "/(submission)/scanReceipt",
                params: { groupID: gID },
              }}
              asChild
            >
              <Button
                title={"Scan Receipt"}
                onPress={() => setPopup(false)}
                buttonStyle={buttonStyles.PopupButton}
              />
            </Link>

            <Button
              buttonStyle={buttonStyles.PopupButton}
              title={"Upload Image"}
              onPress={() => {
                pickImage();
                setPopup(false);
              }}
            />
          </BottomSheet>
        </SafeAreaProvider>

        <DisplayReceipt
          isVisible={itemOV}
          setVisible={setItemOV}
          receiptsList={receiptsList}
          setReceiptsList={setReceiptsList}
          groupID={gID}
          ID={receiptID}
        />
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
  dateInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    width: "50%",
  },
});
