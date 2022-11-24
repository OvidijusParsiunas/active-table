import {USER_SET_COLUMN_TYPE} from '../enums/columnType';
import {TableCellText} from './tableContents';
import {StringDimension} from './dimensions';
import {CSSStyle} from './cssStyle';

// exposed to the client
export interface ColumnSettings {
  columnName: string;
  // if percentage - will use the table width
  // if the accummulated custom column widths are higher than the width in tableDimensions, they will breach that width
  width?: StringDimension;
  minWidth?: StringDimension;
  canWidthBeChanged?: boolean;
  defaultValue?: TableCellText;
  type?: boolean;
  style?: CSSStyle;
  availableTypes?: USER_SET_COLUMN_TYPE[];
  // customTypes?: unknown;
  validation?: unknown;
  isSortAvailable?: boolean;
  isDeleteAvailable?: boolean;
  isMoveAvailable?: boolean;
  isEditable?: boolean;
  insertColumnAvailability?: {
    left?: boolean;
    right?: boolean;
  };
}

// exposed to the client
export type ColumnsSettings = Array<ColumnSettings>;
