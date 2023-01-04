import {CSSStyle, StatefulCSSS} from './cssStyle';

export type PaginationPositionSide =
  | 'top-left'
  | 'top-middle'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-middle'
  | 'bottom-right';

export interface PaginationPosition {
  side: PaginationPositionSide;
  order?: number;
}

export interface PaginationPositions {
  pageButtons?: PaginationPosition;
  numberOfVisibleRows?: PaginationPosition;
  numberOfRowsOptions?: PaginationPosition;
}

export interface NumberOfRowsOptionsStyle<T = StatefulCSSS> {
  container?: CSSStyle;
  prefixText?: CSSStyle;
  button?: T;
  buttonText?: T;
  buttonArrow?: T;
}

type ActionButtonStyle<T> = T & {
  previousText?: string;
  nextText?: string;
  firstText?: string;
  lastText?: string;
};

export interface PageButtonStyle<T = StatefulCSSS> {
  container?: CSSStyle;
  buttons?: T;
  activeButton?: T;
  disabledButtons?: CSSStyle; // disabled buttons do not have any mouse events
  actionButtons?: ActionButtonStyle<T>; // will also use 'buttons' style
}

export interface PaginationStyle<T> {
  pageButtons: PageButtonStyle<T>;
  numberOfVisibleRows?: CSSStyle;
  numberOfRowsOptions?: NumberOfRowsOptionsStyle<T>;
}

export interface NumberOfRowsOptions {
  // 'All'|'all' causes all table rows to be displayed
  options?: (number | 'All' | 'all')[]; // by default [10, 25, 50, 'All']
  prefixText?: string; // by default 'Rows per page'
}

export interface Pagination {
  numberOfRows?: number; // by default set to 10
  numberOfRowsOptions?: NumberOfRowsOptions | boolean;
  maxNumberOfButtons?: number; // by default set to 8
  displayPrevNext?: boolean; // by default true
  displayFirstLast?: boolean; // by default true
  displayNumberOfVisibleRows?: boolean; // by default true
  style?: PaginationStyle<StatefulCSSS>;
  positions?: PaginationPositions;
}
