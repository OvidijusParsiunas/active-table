// if the element is set - it means that it is visible
export interface OverlayElements {
  columnDropdown?: HTMLElement;
  columnTypeDropdown?: HTMLElement;
  fullTableOverlay?: HTMLElement;
  // cannot get the actual date picker as its native browser element is not accessible
  // the cell is probably not the best element for this but its use is very efficient
  datePickerCell?: HTMLElement;
}
