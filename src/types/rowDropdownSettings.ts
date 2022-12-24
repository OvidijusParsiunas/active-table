import {DropdownDisplaySettings} from './dropdownDisplaySettings';

export interface RowDropdownSettings {
  displaySettings: DropdownDisplaySettings;
  isInsertUpAvailable?: boolean; // true by default
  isInsertDownAvailable?: boolean; // true by default
  isMoveAvailable?: boolean; // false by default
  // useful for case where the user should not be able to insert/delete/move the header
  isHeaderRowEditable?: boolean; // same value as isMoveAvailable by default
  isDeleteAvailable?: boolean; // true by default
}
