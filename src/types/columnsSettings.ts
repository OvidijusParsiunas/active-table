import {USER_SET_COLUMN_TYPE} from '../enums/columnType';
import {TableCellText} from './tableContents';
import {StringDimension} from './dimensions';
import {CSSStyle} from './cssStyle';

// exposed to the client
export interface ColumnSettings {
  columnName: string;
  width?: StringDimension;
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
