import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { LinkedGroupEditor } from "@/components/LinkedGroupEditor";
import { addSingleGroup } from "@/app/database/groups";
import { connectToDb } from "@/app/database/db";
import { GroupType, ReceiptType } from "../../../Other/types";

export default function displayGroupPage() {
  const { groupID } = useLocalSearchParams();
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
  const [receiptsList, setReceiptsList] = useState<ReceiptType[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (Array.isArray(groupID)) {
        setCurrentGroupId(parseInt(groupID[0], 10));
      } else if (groupID !== undefined) {
        setCurrentGroupId(parseInt(groupID, 10));
      }
    }, [groupID])
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
