import {DropdownDisplaySettings} from './dropdownDisplaySettings';

export interface ColumnDropdownSettings {
  isSortAvailable?: boolean; // true by default
  isDeleteAvailable?: boolean; // true by default
  isInsertLeftAvailable?: boolean; // true by default
  // please note that when this is true and the user pastes data before this column - instead of overwriting proceeding
  // columns - new ones will instead be inserted before the subject column, also if the user pastes data on it - no
  // proceeding columns will be overwritten and no new ones will be inserted
  // if this is set to false on last column and displayAddNewColumn is true - the user will be able to add new columns
  isInsertRightAvailable?: boolean; // true by default
  isMoveAvailable?: boolean; // true by default
}

// displaySettings is only available for default columns for UX consistency
export type ColumnDropdownSettingsDefault = {displaySettings: DropdownDisplaySettings} & ColumnDropdownSettings;
