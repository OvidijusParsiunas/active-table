import {FocusedCell} from './focusedCell';

export interface FocusedElements {
  cell: FocusedCell;
  cellDropdown?: HTMLElement;
  rowDropdown?: HTMLElement;
  colDragEl?: HTMLElement; // clone cell
  rowDragEl?: HTMLElement; // real row
}
