import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import { LinkedGroupEditor } from "@/components/LinkedGroupEditor";
import { addSingleGroup } from "@/app/database/groups";
import { connectToDb } from "@/app/database/db";
import { GroupType, ReceiptType } from "../../types";

export default function displayGroupPage() {
  const { groupID, createGroup } = useLocalSearchParams();
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
  const [receiptsList, setReceiptsList] = useState<ReceiptType[]>([]);

  useEffect(() => {
    if (Array.isArray(groupID)) {
      setCurrentGroupId(parseInt(groupID[0], 10));
    } else if (groupID !== undefined) {
      setCurrentGroupId(parseInt(groupID, 10));
      console.log(groupID, 2, "back");
    }
    console.log(groupID, "back");
  }, [groupID]);

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

  useEffect(() => {
    if (createGroup === "true") {
      createNewGroup();
    }
  }, [createGroup]);

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
