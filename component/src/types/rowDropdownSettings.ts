import {DropdownDisplaySettings} from './dropdownDisplaySettings';

export interface RowDropdownSettings {
  displaySettings: DropdownDisplaySettings;
  isInsertUpAvailable?: boolean; // true by default
  isInsertDownAvailable?: boolean; // true by default
  isMoveAvailable?: boolean; // true by default
  isDeleteAvailable?: boolean; // true by default
  // useful for case where the user should not be able to insert/delete/move the header
  canEditHeaderRow?: boolean; // true by default
}
