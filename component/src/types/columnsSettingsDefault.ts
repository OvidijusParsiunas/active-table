import {DropdownDisplaySettings} from './dropdownDisplaySettings';
import {ColumnDropdownSettings} from './columnDropdownSettings';
import {CustomColumnSettings} from './columnsSettings';
import {StringDimension} from './dimensions';
import {CellCSSStyle} from './cssStyle';

type MultiWidthStyle = CellCSSStyle & {width?: StringDimension; minWidth?: StringDimension};

// displaySettings is only available for default columns for UX consistency
export interface ColumnDropdownSettingsDisplay extends ColumnDropdownSettings {
  displaySettings: DropdownDisplaySettings;
}

export type ColumnsSettingsDefault = Omit<CustomColumnSettings<MultiWidthStyle>, 'headerName'> & {
  dropdown?: ColumnDropdownSettingsDisplay;
};
