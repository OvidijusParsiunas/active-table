import {Pagination} from './pagination';

export interface PaginationInternal extends Pagination {
  buttonContainer?: HTMLElement;
  visibleRows: HTMLElement[];
  activeButtonNumber: number;
}
