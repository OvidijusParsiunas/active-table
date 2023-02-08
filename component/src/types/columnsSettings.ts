import {DEFAULT_COLUMN_TYPES} from '../enums/defaultColumnTypes';
import {ColumnDropdownSettings} from './columnDropdownSettings';
import {HeaderIconStyle} from './headerIconStyle';
import {HoverableStyles} from './hoverableStyles';
import {NoDimensionCSSStyle} from './cssStyle';
import {StringDimension} from './dimensions';
import {ColumnTypes} from './columnType';
import {CellText} from './tableContent';

// to be used by the client

// difference between column settings and details is that details is more about the values that are set throughout
// the component runtime duration and settings are values that can be set by the user which control its behaviour

interface Parent<CellStyle> {
  headerName: string;
  defaultText?: CellText;
  isDefaultTextRemovable?: boolean; // true by default
  cellStyle?: CellStyle;
  isColumnResizable?: boolean; // true by default, if no width is defined this will simply just not show the sizer
  isCellTextEditable?: boolean; // true by default
  headerStyles?: HoverableStyles;
  isHeaderTextEditable?: boolean; // uses isCellTextEditable by default
  headerIconStyle?: HeaderIconStyle;
  availableDefaultColumnTypes?: DEFAULT_COLUMN_TYPES[]; // this will reduce the default types to ones included here
  customColumnTypes?: ColumnTypes; // additional custom column types
  // If not provided defaultActiveTypeName will default to first of the following:
  // First type to not have validation/First available type/'Text'
  defaultActiveTypeName?: string;
  columnDropdown?: ColumnDropdownSettings;
}

// REF-24
// if width dimension is a percentage - will use the table width
// if total custom columns width is higher than the width in tableStyle, they will breach that width
export type DimensionalCSSStyle = NoDimensionCSSStyle & {width?: StringDimension};

export type CustomColumnSettings<T = DimensionalCSSStyle> = Parent<T>;

export type CustomColumnsSettings = Array<CustomColumnSettings>;
