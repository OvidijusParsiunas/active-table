import {ColumnDropdownSettings} from './columnDropdownSettings';
import {InterfacesUnion, SetRequired} from './utilityTypes';
import {ColumnTypesInternal} from './columnTypeInternal';
import {CustomColumnSettings} from './columnsSettings';
import {NoDimensionCSSStyle} from './cssStyle';
import {StringDimension} from './dimensions';

// to be used internally

type InternalSettings = CustomColumnSettings<NoDimensionCSSStyle> & {
  dropdown: ColumnDropdownSettings;
  // encompasses processed types available for the column
  // the reason why this is here is because this is processed once and settings is then added to column details
  types: ColumnTypesInternal;
};

interface Width extends InternalSettings {
  // REF-24
  // if dimension is a percentage - will use the table width
  // if total custom columns width is higher than the width in tableStyle, they will breach that width
  width: StringDimension;
}

interface MinWidth extends InternalSettings {
  // REF-24
  // if dimension is a percentage - will use the table width
  // if total custom columns width is higher than the width in tableStyle, they will breach that width
  minWidth: StringDimension;
}

// if the user proceeds to set width and minWidth properties - minWidth will take precedence
export type ColumnSettingsInternal = InterfacesUnion<
  BuildInternalSettingsInterfacesUnion<Width | MinWidth | InternalSettings>
>;

// Interfaces extends Parent allows the Interfaces type to be a union of types - allowing this to return a union of types
type BuildInternalSettingsInterfacesUnion<Interfaces> = Interfaces extends InternalSettings
  ? Omit<
      SetRequired<Interfaces, 'defaultText' | 'isDefaultTextRemovable' | 'isCellTextEditable' | 'isHeaderTextEditable'>,
      'headerName'
    > &
      StylePrecedence
  : never;

// REF-23
interface StylePrecedence {
  stylePrecedence?: boolean;
}

// the benefits of this over the client provided array is that settings can be accessed immediately when
// cell text is known instead of traversing an array.
export type ColumnsSettingsMap = {
  [key: string]: ColumnSettingsInternal;
};
