import {DropdownButtonItemSettings} from './dropdownButtonItem';

export interface ColumnTypeDropdownItem {
  element: HTMLElement; // storing the element as we don't want to rebuild it from scratch every time
  settings: DropdownButtonItemSettings;
}
