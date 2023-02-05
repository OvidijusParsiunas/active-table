import {CellDropdownOptionStyle, CellDropdownStyle} from './cellDropdown';
import {GlobalItemColors} from './itemToColor';

export interface LabelDetails {
  globalItemColors: GlobalItemColors;
  colorPickerContainer?: HTMLElement; // set when picker is opened
  colorPickerNewValue?: {
    itemText: string;
    backgroundColor: string;
  };
}

interface ScrollbarPresence {
  horizontal: boolean;
  vertical: boolean;
}

export interface ActiveCellDropdownItems {
  matchingWithCellText?: HTMLElement;
  hovered?: HTMLElement;
}

interface CellDropdownItemDetails {
  backgroundColor: string;
  element: HTMLElement;
}

interface CellDropdownItemsDetails {
  [itemText: string]: CellDropdownItemDetails;
}

// using I to detone internal type
export interface CellDropdownI {
  itemsDetails: CellDropdownItemsDetails;
  activeItems: ActiveCellDropdownItems; // items that exhibit certain behaviours
  element: HTMLElement; // REF-8
  scrollbarPresence: ScrollbarPresence;
  customDropdownStyle?: CellDropdownStyle;
  customItemStyle?: CellDropdownOptionStyle;
  canAddMoreOptions: boolean;
  displayedCellElement?: HTMLElement;
  labelDetails?: LabelDetails; // extra properties that are used for the label type that are not by the basic select type
}
