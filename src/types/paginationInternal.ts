import {Pagination} from './pagination';

export interface PaginationInternal extends Required<Pagination> {
  buttonContainer?: HTMLElement;
  visibleRows: HTMLElement[];
  activeButtonNumber: number;
}
