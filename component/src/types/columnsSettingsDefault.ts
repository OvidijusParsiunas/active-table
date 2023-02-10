import {ColumnDropdownSettingsDefault} from './columnDropdownSettings';
import {ColumnSettingsInternal} from './columnsSettingsInternal';

export type DefaultColumnsSettings = ColumnSettingsInternal & {
  columnDropdown: ColumnDropdownSettingsDefault;
};
