import { SQLiteDatabase } from "react-native-sqlite-storage";
import { GroupType, LineDataPoints } from "../(tabs)/types";

export const addGroup = async (db: SQLiteDatabase, groups: GroupType[]) => {
  const insertQuery = `
     INSERT OR REPLACE INTO Groups (name, total, upload_date, purchase_date)
     VALUES (?, ?, ?, ?)
   `;

  console.log("Starting to add groups");

  try {
    for (const group of groups) {
      const values = [
        group.name,
        group.total,
        group.upload_date,
        group.purchase_date,
      ];

      try {
        await db.executeSql(insertQuery, values);
      } catch (error) {
        console.error(`Failed to save ${group.name}:`, error);
      }
    }

    console.log("Finished adding groups");

    return true;
  } catch (error) {
    console.error("Failed to add groups:", error);
    throw new Error("Failed to add groups");
  }
};

export const addSingleGroup = async (db: SQLiteDatabase, group: GroupType) => {
  const insertQuery = `
     INSERT OR REPLACE INTO Groups (name, total, upload_date, purchase_date)
     VALUES (?, ?, ?, ?)
   `;

  try {
    const result = await db.executeSql(insertQuery, [
      group.name,
      group.total,
      group.upload_date,
      group.purchase_date,
    ]);

    console.log("Finished adding group");
    return result[0].insertId;
  } catch (error) {
    console.error("Failed to add groups:", error);
    throw new Error("Failed to add groups");
  }
};

export const getGroups = async (db: SQLiteDatabase): Promise<GroupType[]> => {
  try {
    const groups: GroupType[] = [];
    const query = `SELECT * FROM Groups`;
    const results = await db.executeSql(query);
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        groups.push(result.rows.item(index));
      }
    });
    return groups;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get groups from database");
  }
};

export const getSingleGroup = async (
  db: SQLiteDatabase,
  id: number
): Promise<GroupType | null> => {
  try {
    const query = `SELECT * FROM Groups WHERE id = ?`;
    const results = await db.executeSql(query, [id]);

    if (results[0].rows.length > 0) {
      const row = results[0].rows.item(0);
      const group: GroupType = {
        id: row.id,
        name: row.name,
        total: row.total,
        upload_date: row.upload_date,
        purchase_date: row.purchase_date,
      };
      return group;
    } else {
      return null; // No group found with the given ID
    }
  } catch (error) {
    console.error(error);
    throw Error("Group not found from database");
  }
};

//remember to update total on change in items
export const updateGroup = async (db: SQLiteDatabase, group: GroupType) => {
  const updateQuery = `
      UPDATE Groups
      SET name = ?, total = ?, upload_date = ?, purchase_date = ?
      WHERE id = ?
    `;
  const values = [
    group.name,
    group.total,
    group.upload_date,
    group.purchase_date,
    group.id,
  ];
  try {
    return db.executeSql(updateQuery, values);
  } catch (error) {
    console.error(error);
    throw Error("Failed to update group");
  }
};

export const searchGroups = async (db: SQLiteDatabase, month: number, year: number): Promise<LineDataPoints[]> => {
  try{
    const data: LineDataPoints[] = []
    const query = `SELECT purchase_date, total FROM groups WHERE strftime('%Y', purchase_date) = ? AND  strftime('%m', purchase_date) = ?`;
    const paddedMonth = month < 10 ? `0${month}` : `${month}`;

    const results = await db.executeSql(query, [year.toString(), paddedMonth]);
    results?.forEach((x) => {
      for (let index = 0; index < x.rows.length; index++) {
        const temp = x.rows.item(index)
        data.push({
          date: new Date(temp.purchase_date),
          amount: temp.total
        });
      }
    });
    return data
  }catch (error){
    console.error(error);
    throw Error("Failed pull groups with this date");
  }
}

export const deleteGroup = async (db: SQLiteDatabase, group: number) => {
  const deleteQuery = `
      DELETE FROM Groups
      WHERE id = ?
    `;
  const values = [group];
  try {
    return db.executeSql(deleteQuery, values);
  } catch (error) {
    console.error(error);
    throw Error("Failed to remove contact");
  }
};
