import {PageButtonStyles, Pagination, PaginationPositions, PaginationStyles} from './pagination';
import {StatefulCSS} from './cssStyle';

interface ActiveButtonClass {
  activeButtonClass: 'pagination-button-active' | 'pagination-button-active-precedence';
}

// (InternalPageButtonsStyle)
export type IPageButtonsStyles = Required<PageButtonStyles<Required<StatefulCSS>>> & ActiveButtonClass;

// (InternalPaginationStyle)
export interface IPaginationStyles extends PaginationStyles<Required<StatefulCSS>> {
  pageButtons: IPageButtonsStyles;
}

export interface PaginationInternal extends Required<Pagination> {
  styles: IPaginationStyles;
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
