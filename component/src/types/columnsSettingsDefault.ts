import {ColumnDropdownSettingsDefault} from './columnDropdownSettings';
import {CustomColumnSettings} from './columnsSettings';

export type ColumnsSettingsDefault = Omit<CustomColumnSettings, 'headerName'> & {
  columnDropdown?: ColumnDropdownSettingsDefault;
};
