import {DropdownDisplaySettings} from './dropdownDisplaySettings';
import {ColumnDropdownSettings} from './columnDropdownSettings';
import {CustomColumnSettings} from './columnsSettings';
import {NoDimensionCSSStyle} from './cssStyle';
import {StringDimension} from './dimensions';

type MultiWidthStyle = NoDimensionCSSStyle & {width?: StringDimension; minWidth?: StringDimension};

// displaySettings is only available for default columns for UX consistency
export interface ColumnDropdownSettingsDisplay extends ColumnDropdownSettings {
  displaySettings: DropdownDisplaySettings;
}

export type ColumnsSettingsDefault = Omit<CustomColumnSettings<MultiWidthStyle>, 'headerName'> & {
  dropdown?: ColumnDropdownSettingsDisplay;
};
