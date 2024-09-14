import { SQLiteDatabase } from "react-native-sqlite-storage";
import { ReceiptType } from "../Other/types";

export const addReceipt = async (
  db: SQLiteDatabase,
  receipts: ReceiptType[]
) => {
  const insertQuery = `
    INSERT OR REPLACE INTO Receipts (group_id, name, total)
    VALUES (?, ?, ?)
  `;

  try {
    for (const receipt of receipts) {
      const values = [receipt.group_id, receipt.name, receipt.total];

      try {
        await db.executeSql(insertQuery, values);
      } catch (error) {
        console.error(`Failed to save ${receipt.name}:`, error);
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to add groups:", error);
    throw new Error("Failed to add groups");
  }
};

export const addSingleReceipt = async (
  db: SQLiteDatabase,
  receipt: ReceiptType
): Promise<number> => {
  const insertQuery = `
  INSERT OR REPLACE INTO Receipts (group_id, name, total)
  VALUES (?, ?, ?)
`;

  try {
    const result = await db.executeSql(insertQuery, [
      receipt.group_id,
      receipt.name,
      receipt.total,
    ]);

    return result[0].insertId;
  } catch (error) {
    console.error("Failed to add receipt", error);
    throw new Error("Failed to add receipt");
  }
};

export const getReceipts = async (
  db: SQLiteDatabase,
  group: number
): Promise<ReceiptType[]> => {
  try {
    const receipts: ReceiptType[] = [];
    const query = `SELECT id, name, total FROM Receipts WHERE group_id = ${group}`;
    const results = await db.executeSql(query);
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        receipts.push(result.rows.item(index));
      }
    });
    return receipts;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get Receipts from database");
  }
};

export const getSingleReceipt = async (
  db: SQLiteDatabase,
  receiptId: number
): Promise<ReceiptType | null> => {
  try {
    const query = `SELECT id, name, total, group_id FROM Receipts WHERE id = ${receiptId}`;
    const results = await db.executeSql(query);

    if (results.length > 0 && results[0].rows.length > 0) {
      const receipt = results[0].rows.item(0) as ReceiptType;
      return receipt;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw Error("Failed to get Receipt from database");
  }
};

export const updateReceipt = async (
  db: SQLiteDatabase,
  receipt: ReceiptType
) => {
  const updateQuery = `
      UPDATE Receipts
      SET name = ?, total = ?
      WHERE id = ?
    `;
  const values = [receipt.name, receipt.total, receipt.id];
  try {
    return db.executeSql(updateQuery, values);
  } catch (error) {
    console.error(error);
    throw Error("Failed to update Receipts");
  }
};

//Update total in group
export const deleteReceipt = async (db: SQLiteDatabase, receipt: number) => {
  const deleteQuery = `
      DELETE FROM Receipts
      WHERE id = ?
    `;
  const values = [receipt];
  try {
    return db.executeSql(deleteQuery, values);
  } catch (error) {
    console.error(error);
    throw Error("Failed to remove Receipts");
  }
};
