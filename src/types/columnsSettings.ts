import {HoverableElementStyleClient} from './hoverableElementStyle';
import {USER_SET_COLUMN_TYPE} from '../enums/columnType';
import {InterfacesUnion} from './utilityTypes';
import {TableCellText} from './tableContents';
import {StringDimension} from './dimensions';
import {CSSStyle} from './cssStyle';

interface Parent {
  columnName: string;
  defaultValue?: TableCellText;
  cellStyle?: CSSStyle;
  header?: HoverableElementStyleClient;
  type?: boolean;
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

// TO-DO - can probably make width part of the cellStyle
interface Width extends Parent {
  // if percentage - will use the table width
  // if the accummulated custom column widths are higher than the width in tableDimensions, they will breach that width
  width: StringDimension;
}

interface MinWidth extends Parent {
  // if percentage - will use the table width
  // if the accummulated custom column widths are higher than the width in tableDimensions, they will breach that width
  minWidth: StringDimension;
}

// exposed to the client
// if the user proceeds to set width and minWidth properties - minWidth will take precedence
export type ColumnSettings = InterfacesUnion<Width | MinWidth | Parent>;

// exposed to the client
export type ColumnsSettings = Array<ColumnSettings>;

// The following was in a SEPARATE FILE to follow client/internal type naming pattern however it needs access to the Width,
// MinWidth and parent in order to omit the columnName property, hence instead of exposing these publicly and polluting
// the intellisense suggested namespaces, I placed these types into the same file

// should be used internally
// if the user proceeds to set width and minWidth properties - minWidth will take precedence
export type ColumnSettingsInternal = InterfacesUnion<
  Omit<Width, 'columnName'> | Omit<MinWidth, 'columnName'> | Omit<Parent, 'columnName'>
>;

// should be used internally
// the benefits of this over the client provided array is that settings can be accessed immediately when
// cell text is known instead of traversing an array.
export type ColumnsSettingsMap = {
  [key: string]: ColumnSettingsInternal;
};
