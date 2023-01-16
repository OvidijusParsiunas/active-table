import {HoverableElementStyleClient} from './hoverableElementStyle';
import {DEFAULT_COLUMN_TYPES} from '../enums/columnType';
import {HeaderIconStyle} from './headerIconStyle';
import {InterfacesUnion} from './utilityTypes';
import {StringDimension} from './dimensions';
import {ColumnTypes} from './columnType';
import {CellText} from './tableContents';
import {CellCSSStyle} from './cssStyle';

// to be used by the client

// difference between column settings and details is that details is more about the values that are set throughout
// the component runtime duration and settings are values that can be set by the user which control its behaviour

interface Parent<CellStyle> {
  columnName: string;
  defaultText?: CellText;
  isDefaultTextRemovable?: boolean; // true by default
  cellStyle?: CellStyle;
  isCellTextEditable?: boolean; // true by default
  headerStyleProps?: HoverableElementStyleClient;
  isHeaderTextEditable?: boolean; // uses isCellTextEditable by default
  headerIconStyle?: HeaderIconStyle;
  defaultColumnTypes?: DEFAULT_COLUMN_TYPES[]; // this will reduce the default types to ones included here
  customColumnTypes?: ColumnTypes; // additional custom column types
  // If not provided activeTypeName will default to first of the following:
  // First type to not have validation/First available type/'Text'
  activeTypeName?: string;
  isSortAvailable?: boolean; // true by default
  isDeleteAvailable?: boolean; // true by default
  isInsertLeftAvailable?: boolean; // true by default
  // please note that when this is true and the user pastes data before this column - instead of overwriting proceding
  // columns - new ones will instead be inserted before the subject column, also if the user pastes data on it - no
  // proceeding columns will be overwritten and no new ones will be inserted
  isInsertRightAvailable?: boolean; // true by default
  isMoveAvailable?: boolean; // false by default
}

// REF-24
// if dimension is a percentage - will use the table width
// if total custom columns width is higher than the width in tableStyle, they will breach that width
export type CustomColumnWidth = InterfacesUnion<{width: StringDimension} | {minWidth: StringDimension} | {}>;

type DimensionalCSSStyle = CellCSSStyle & CustomColumnWidth;

// if the user proceeds to set width and minWidth properties - minWidth will take precedence
export type CustomColumnSettings<T = DimensionalCSSStyle> = Parent<T>;

export type CustomColumnsSettings = Array<CustomColumnSettings>;
