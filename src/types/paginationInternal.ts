import {PageButtonStyle, Pagination, PaginationPositions, PaginationStyle} from './pagination';
import {StatefulCSSS} from './cssStyle';

// (InternalPageButtonsStyle)
export type IPageButtonsStyle = Required<PageButtonStyle<Required<StatefulCSSS>>>;

// (InternalPaginationStyle)
export interface IPaginationStyle extends PaginationStyle<Required<StatefulCSSS>> {
  pageButtons: IPageButtonsStyle;
}

export interface PaginationInternal extends Required<Pagination> {
  style: IPaginationStyle;
  positions: Required<PaginationPositions>;
  buttonContainer: HTMLElement;
  numberOfVisibleRowsElement?: HTMLElement;
  numberOfRowsDropdown?: HTMLElement;
  visibleRows: HTMLElement[];
  activePageNumber: number;
  programaticallyHoveredPageNumberButton?: HTMLElement;
  clickedPageNumberButton?: boolean; // REF-30
  mouseDownOnNumberOfRowsButton?: boolean;
  isAllRowsOptionSelected: boolean;
  numberOfRowsOptionsItemText: string[];
}
