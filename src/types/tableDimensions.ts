export interface TableDimensions {
  // when width and maxWidth are both added - width takes priority and columns are set according to that property
  width?: number;
  // WORK - can potentially remove maxWidth if width is present to simplify the code
  maxWidth?: number;
  minWidth?: number;
  // WORK - figure out if we are going to have an internal scroll, also need option for maximum rows, maximum columns
  height?: number;
  maxHeight?: number;
}
