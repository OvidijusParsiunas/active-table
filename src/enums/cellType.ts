export enum CELL_TYPE {
  Number,
  Text,
  // this is used for a cell that has the defaultCellValue, it is never used as a type for the column
  Default,
}

export enum COLUMN_TYPE {
  Number = CELL_TYPE.Number,
  Text = CELL_TYPE.Text,
}
