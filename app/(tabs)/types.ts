export type FileObject = {
  uri: string;
  type: string;
  name: string;
};

export type AppTables = "Groups" | "Items" | "Receipts";

export type ReceiptType = {
  id: number;
  group_id: number;
  name: string;
  total: number;
};

export type GroupType = {
  id: number;
  name: string;
  total: number;
  upload_date: string | number;
  purchase_date: string | number;
};

export type LineDataPoints = {
  date: Date;
  amount: number;
}

export type GroupedTableProps = {
  groupedData: { [key: string]: GroupType[] };
};

type ReceiptItem = {
  name: string;
  price: string;
};

export type ProcessedReceipt = {
  [key: string]: ReceiptItem;
};
