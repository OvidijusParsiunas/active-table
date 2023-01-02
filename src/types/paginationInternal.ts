import {Pagination, PaginationPositions, PaginationStyle} from './pagination';
import {StatefulCSSS} from './cssStyle';

// (InternalPaginationStyle)
export type IPaginationStyle = Required<PaginationStyle<Required<StatefulCSSS>>>;

export interface PaginationInternal extends Required<Pagination> {
  buttonContainer: HTMLElement;
  numberOfVisibleRowsElement?: HTMLElement;
  numberOfRowsOptionsElement?: HTMLElement;
  visibleRows: HTMLElement[];
  activeButtonNumber: number;
  clickedNumberButton?: boolean; // REF-30
  programaticallyHoveredButton?: HTMLElement;
  style: IPaginationStyle;
  positions: Required<PaginationPositions>;
}
