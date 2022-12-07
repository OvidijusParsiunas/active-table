import {HoverableElementStyleClient} from './hoverableElementStyle';
import {InterfacesUnion, SetRequired} from './utilityTypes';
import {DEFAULT_COLUMN_TYPES} from '../enums/columnType';
import {StringDimension} from './dimensions';
import {ColumnTypes} from './columnType';
import {CellText} from './tableContents';
import {CSSStyle} from './cssStyle';

// difference between column settings and details is that details is more about the values that are set throughout
// the component runtime duration and settings are values that can be set by the user which control its behaviour

interface Parent {
  columnName: string;
  defaultText?: CellText;
  isDefaultTextRemovable?: boolean; // true by default
  cellStyle?: CSSStyle;
  header?: HoverableElementStyleClient;
  defaultColumnTypes?: DEFAULT_COLUMN_TYPES[]; // this will reduce the default types to ones included here
  customColumnTypes?: ColumnTypes; // additional custom column types
  // if not provided the following property will default to first of the following:
  // First type to not have validation/First available type/'Text'
  activeTypeName?: string;
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
  // REF-24
  // if percentage - will use the table width
  // if the accummulated custom column widths are higher than the width in tableDimensions, they will breach that width
  width: StringDimension;
}

interface MinWidth extends Parent {
  // REF-24
  // if percentage - will use the table width
  // if the accummulated custom column widths are higher than the width in tableDimensions, they will breach that width
  minWidth: StringDimension;
}

// exposed to the client
// if the user proceeds to set width and minWidth properties - minWidth will take precedence
export type CustomColumnSettings = InterfacesUnion<Width | MinWidth | Parent>;

// exposed to the client
export type CustomColumnsSettings = Array<CustomColumnSettings>;

// The following was in a SEPARATE FILE but it needs access to the Width, MinWidth and Parent in order to omit
// the columnName property, hence instead of exposing these publicly and polluting the intellisense suggested
// namespaces, I placed these types into the same file

// if the user proceeds to set width and minWidth properties - minWidth will take precedence
export type DefaultColumnsSettings = InterfacesUnion<BuildDefaultSettingsInterfacesUnion<Width | MinWidth | Parent>>;

// Interfaces extends Parent allows the Interfaces type to be a union of types - allowing this to return a union of types
type BuildDefaultSettingsInterfacesUnion<Interfaces> = Interfaces extends Parent ? Omit<Interfaces, 'columnName'> : never;

// The following was in a SEPARATE FILE to follow client/internal type naming pattern however it needs access to the Width,
// MinWidth and Parent in order to omit the columnName property, hence instead of exposing these publicly and polluting
// the intellisense suggested namespaces, I placed these types into the same file

// should be used internally
// if the user proceeds to set width and minWidth properties - minWidth will take precedence
export type ColumnSettingsInternal = InterfacesUnion<BuildInternalSettingsInterfacesUnion<Width | MinWidth | Parent>>;

// Interfaces extends Parent allows the Interfaces type to be a union of types - allowing this to return a union of types
type BuildInternalSettingsInterfacesUnion<Interfaces> = Interfaces extends Parent
  ? Omit<SetRequired<Interfaces, 'defaultText' | 'isDefaultTextRemovable'>, 'columnName'>
  : never;

// should be used internally
// the benefits of this over the client provided array is that settings can be accessed immediately when
// cell text is known instead of traversing an array.
export type ColumnsSettingsMap = {
  [key: string]: ColumnSettingsInternal;
};
