import {OuterContainerDropdownI} from './outerContainerInternal';
import {SelectedColumnSizerT} from './columnSizer';

export interface ActiveOverlayElements {
  columnDropdown?: HTMLElement;
  columnTypeDropdown?: HTMLElement;
  rowDropdown?: HTMLElement;
  outerContainerDropdown?: OuterContainerDropdownI;
  fullTableOverlay?: HTMLElement;
  // cannot get the actual date picker as its native browser element is not accessible
  // the cell is probably not the best element for this but its use is very efficient
  datePickerCell?: HTMLElement;
  // originally used shadowRoot.activeElement to identify the hovered dropdown item (to set background color), however
  // noticed an issue where upon opening the dropdown then clicking on browser's console, the activeElement no longer
  // returned latest .focus() element as activeElement
  dropdownItem?: HTMLElement;
  // the reason why this is here and not in ColumnSizerT is because it is more efficient to access these values here
  selectedColumnSizer?: SelectedColumnSizerT;
  loadingDefault?: HTMLElement; // default one
  loadingCustom?: HTMLElement; // controlled by the user via child element
}
