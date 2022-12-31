import {Pagination, PaginationStyle} from './pagination';
import {StatefulCSSS} from './cssStyle';

// (InternalPaginationStyle)
export type IPaginationStyle = Required<PaginationStyle<Required<StatefulCSSS>>>;

export interface PaginationInternal extends Required<Pagination> {
  buttonContainer?: HTMLElement;
  visibleRows: HTMLElement[];
  activeButtonNumber: number;
  clickedNumberButton?: boolean; // REF-30
  style: IPaginationStyle;
}
