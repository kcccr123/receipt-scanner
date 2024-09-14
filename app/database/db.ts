//establish connection with local database
import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from "react-native-sqlite-storage";
import { AppTables } from "../Other/types";

enablePromise(true);

export const connectToDb = async (): Promise<SQLiteDatabase> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error("Database connection timed out.");
      reject(new Error("Database connection timed out."));
    }, 5000); // 5 seconds timeout

    try {
      const db = openDatabase(
        { name: "reciept-scanner-app-frontend.db", location: "default" },
        () => {
          clearTimeout(timeout); // Clear the timeout if connected
          resolve(db); // Resolve the promise with the db object
        },
        (error) => {
          clearTimeout(timeout); // Clear the timeout if there's an error
          console.error("Database connection error: ", error);
          reject(new Error("Could not connect to database")); // Reject the promise on error
        }
      );
      if (!db) {
        // Explicit check if db is null or undefined
        throw new Error("Database initialization returned null or undefined");
      }
    } catch (error) {
      clearTimeout(timeout); // Clear the timeout if an error is caught
      console.error("Unexpected error in connectToDb: ", error);
      reject(error); // Reject promise with the error
    }
  });
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query1 = `CREATE TABLE IF NOT EXISTS Groups(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    total DECIMAL(7, 2),
    upload_date DATE,
    purchase_date DATE 
  );`;

  const query2 = `CREATE TABLE IF NOT EXISTS Receipts(
    group_id INTEGER NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    total DECIMAL(7, 2),
    FOREIGN KEY (group_id)
      REFERENCES Groups(id)
      ON DELETE CASCADE
  );`;

  const query3 = `CREATE TABLE IF NOT EXISTS Items(
    receipt_id INTEGER NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price DECIMAL(7, 2),
    FOREIGN KEY (receipt_id)
      REFERENCES Receipts(id)
      ON DELETE CASCADE
  );`;
  try {
    await db.executeSql(query1);
    await db.executeSql(query2);
    await db.executeSql(query3);
  } catch (error) {
    console.error(error);
    throw Error("Table Initializations Failed");
  }
};

export const fetchTables = async (db: SQLiteDatabase): Promise<string[]> => {
  try {
    const tableNames: string[] = [];
    const results = await db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        tableNames.push(result.rows.item(index).name);
      }
    });
    return tableNames;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};

export const removeTable = async (db: SQLiteDatabase, tableName: AppTables) => {
  const query = `DROP TABLE IF EXISTS ${tableName}`;
  try {
    await db.executeSql(query);
  } catch (error) {
    console.error(error);
    throw Error(`Failed to drop table ${tableName}`);
  }
};
