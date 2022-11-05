export interface TableDimensions {
  // width and maxWidth are mutually exclusive and if both are present width is the only one that is used
  // WORK - percentage should also be available
  width?: number;
  maxWidth?: number;
  minWidth?: number;
  // WORK - figure out if we are going to have an internal scroll, also need option for maximum rows, maximum columns
  height?: number;
  maxHeight?: number;
}
