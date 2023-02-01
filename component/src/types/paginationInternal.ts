import {PageButtonStyle, Pagination, PaginationPositions, PaginationStyle} from './pagination';
import {StatefulCSS} from './cssStyle';

interface ActiveButtonClass {
  activeButtonClass: 'pagination-button-active' | 'pagination-button-active-precedence';
}

// (InternalPageButtonsStyle)
export type IPageButtonsStyle = Required<PageButtonStyle<Required<StatefulCSS>>> & ActiveButtonClass;

// (InternalPaginationStyle)
export interface IPaginationStyle extends PaginationStyle<Required<StatefulCSS>> {
  pageButtons: IPageButtonsStyle;
}

export interface PaginationInternal extends Required<Pagination> {
  style: IPaginationStyle;
  dropdownWidth: number;
  positions: Required<PaginationPositions>;
  buttonContainer: HTMLElement;
  visibleEdgeButtons: [] | [HTMLElement, HTMLElement]; // [firstVisible, lastVisible]
  numberOfActionButtons: number;
  numberOfVisibleRowsElement?: HTMLElement;
  visibleRows: HTMLElement[];
  activePageNumber: number;
  programaticallyHoveredPageNumberButton?: HTMLElement;
  clickedPageNumberButton?: boolean; // REF-30
  rowsPerPageDropdown?: HTMLElement;
  mouseDownOnRowsPerPageButton?: boolean;
  isAllRowsOptionSelected: boolean;
  rowsPerPageOptionsItemText: string[];
}
