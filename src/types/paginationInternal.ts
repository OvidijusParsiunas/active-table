import {Pagination, PaginationPositions, PaginationStyle} from './pagination';
import {StatefulCSSS} from './cssStyle';

// (InternalPaginationStyle)
export type IPaginationStyle = Required<PaginationStyle<Required<StatefulCSSS>>>;

export interface PaginationInternal extends Required<Pagination> {
  buttonContainer: HTMLElement;
  numberOfVisibleRowsElement?: HTMLElement;
  numberOfRowsDropdown?: HTMLElement;
  visibleRows: HTMLElement[];
  activeButtonNumber: number;
  style: IPaginationStyle;
  positions: Required<PaginationPositions>;
  programaticallyHoveredButton?: HTMLElement;
  clickedNumberButton?: boolean; // REF-30
  mouseDownOnNumberOfRowsButton?: boolean;
  isAllRowsOptionSelected: boolean;
  numberOfRowsOptionsItemText: string[];
}
