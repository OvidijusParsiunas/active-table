import {CellText} from './tableContents';

export interface ColumnType {
  name: string;
  validation?: (cellText: CellText) => boolean;
  removeOnFailedValidation?: boolean;
  failedValidationStyle?: () => void;
  customValidationStyleColors?: () => void;
  // * @param compareFn Function used to determine the order of the elements. It is expected to return
  // * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
  // * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
  sorting?: {
    ascending: (cellText1: CellText, cellText2: CellText) => number;
    descending: (cellText1: CellText, cellText2: CellText) => number;
  };
  calendar?: {};
  category?: {};
  // restrict what options a category can have
  defaultText?: CellText;
}

export type ColumnTypes = ColumnType[];
