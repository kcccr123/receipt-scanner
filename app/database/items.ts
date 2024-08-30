import { SQLiteDatabase } from "react-native-sqlite-storage";
import { ItemType } from "@/components/ItemEditor/types";

export const addItem = async (db: SQLiteDatabase, items: ItemType[]) => {
  if (items.length > 0) {
    const insertQuery = `
    INSERT OR REPLACE INTO Items (receipt_id, name, price) VALUES
    ${items.map(() => "(?, ?, ?)").join(", ")}
  `;
    // Flatten the values into a single array to match the placeholders
    const values = items.flatMap((item) => [
      item.receipt_id,
      item.name,
      item.price,
    ]);
    try {
      console.log("complete adding reciept");
      return db.executeSql(insertQuery, values);
    } catch (error) {
      console.error(error);
      throw Error("Failed to add item");
    }
  }
};

export const addSingleItem = async (
  db: SQLiteDatabase,
  item: ItemType
): Promise<number> => {
  const insertQuery = `
  INSERT OR REPLACE INTO Items (receipt_id, name, price) 
  VALUES (?, ?, ?)
`;
  // Flatten the values into a single array to match the placeholders
  try {
    const result = await db.executeSql(insertQuery, [
      item.receipt_id,
      item.name,
      item.price,
    ]);
    return result[0].insertId;
  } catch (error) {
    console.error(error);
    throw Error("Failed to add item");
  }
};

export const getItems = async (
  db: SQLiteDatabase,
  receipt: number
): Promise<ItemType[]> => {
  try {
    const items: ItemType[] = [];
    const query = `SELECT id, name, price FROM Items WHERE receipt_id = ${receipt}`;
    const results = await db.executeSql(query);
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        items.push(result.rows.item(index));
      }
    });
    return items;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get items from database");
  }
};

export const updateItem = async (db: SQLiteDatabase, item: ItemType) => {
  const updateQuery = `
      UPDATE Items
      SET name = ?, price = ?
      WHERE id = ?
    `;
  const values = [item.name, item.price, item.id];
  try {
    return db.executeSql(updateQuery, values);
  } catch (error) {
    console.error(error);
    throw Error("Failed to update item");
  }
};

//Update total in reciept?
export const deleteItem = async (db: SQLiteDatabase, item: number) => {
  const deleteQuery = `
      DELETE FROM Items
      WHERE id = ?
    `;
  const values = [item];
  try {
    return db.executeSql(deleteQuery, values);
  } catch (error) {
    console.error(error);
    throw Error("Failed to remove item");
  }
};
