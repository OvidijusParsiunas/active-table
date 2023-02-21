export type CellText = number | string;

export type TableRow = CellText[];

// the component `content` property does not use this type to make it easierfor the user to interpret it
export type TableContent = TableRow[];
