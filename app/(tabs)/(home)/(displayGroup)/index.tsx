import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { LinkedGroupEditor } from "@/components/LinkedGroupEditor";
import { addSingleGroup } from "@/app/database/groups";
import { connectToDb } from "@/app/database/db";
import { GroupType, ReceiptType } from "../../types";

export default function displayGroupPage() {
  const { groupID, createGroup } = useLocalSearchParams();
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
  const [receiptsList, setReceiptsList] = useState<ReceiptType[]>([]);

  const createNewGroup = async () => {
    const db = await connectToDb();

    const newGroupInfo: GroupType = {
      id: -1,
      name: " ",
      total: 0.0,
      purchase_date: "9999-12-30",
      upload_date: "9999-12-30",
    };

    const newGroupId = await addSingleGroup(db, newGroupInfo);
    setCurrentGroupId(newGroupId);
  };
  useFocusEffect(
    useCallback(() => {
      console.log("running");
      if (Array.isArray(groupID)) {
        setCurrentGroupId(parseInt(groupID[0], 10));
      } else if (groupID == null) {
        if (createGroup === "true") {
          createNewGroup();
        }
      } else {
        setCurrentGroupId(parseInt(groupID, 10));
      }
      console.log(groupID, 2, "back");
      console.log(currentGroupId, "back");
    }, [groupID]) // The dependency array should include groupID to rerun when groupID changes
  );

  return (
    <>
      <LinkedGroupEditor
        groupID={currentGroupId}
        receiptsList={receiptsList}
        setReceiptsList={setReceiptsList}
      />
    </>
  );
}
