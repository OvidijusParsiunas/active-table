// if the element is set - it means that it is visible
export interface OverlayElements {
  columnDropdown?: HTMLElement;
  columnTypeDropdown?: HTMLElement;
  fullTableOverlay?: HTMLElement;
  // cannot get the actual date picker as its native browser element is not accessible
  datePickerInput?: HTMLInputElement;
}
