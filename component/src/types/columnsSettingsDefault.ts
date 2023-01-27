import {DropdownDisplaySettings} from './dropdownDisplaySettings';
import {ColumnDropdownSettings} from './columnDropdownSettings';
import {CustomColumnSettings} from './columnsSettings';

// displaySettings is only available for default columns for UX consistency
export interface ColumnDropdownSettingsDisplay extends ColumnDropdownSettings {
  displaySettings: DropdownDisplaySettings;
}

export type ColumnsSettingsDefault = Omit<CustomColumnSettings, 'headerName'> & {
  dropdown?: ColumnDropdownSettingsDisplay;
};
