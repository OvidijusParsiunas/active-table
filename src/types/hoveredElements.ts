export interface HoveredElements {
  // need to keep track of hovered date cells in order not to hide icon when mouse is hovered on one
  dateCell?: HTMLElement;
  headerCell?: HTMLElement;
  leftMostCell?: HTMLElement; // this can either be an index cell or the first column cell
}
