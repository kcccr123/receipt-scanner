export type FileObject = {
    uri: string;
    type: string;
    name: string;
  };

export type AppTables = "Groups" | "Items" | "Receipts";

export type ItemType = {
  id: number;
  receipt_id: number;
  name: string;
  price: number;
};

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
  upload_date: string|number;
  purchase_date:string|number;
}
export type GroupedTableProps = {
  groupedData: { [key: string]: GroupType[] };
};