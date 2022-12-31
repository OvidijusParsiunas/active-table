import {CSSStyle, StatefulCSSS} from './cssStyle';
import {PX} from './dimensions';

interface ContainerStyle {
  border: string;
  margin?: PX;
  marginTop?: PX;
  marginLeft?: PX;
  marginRight?: PX;
  marginBottom?: PX;
  top?: PX;
  left?: PX;
  right?: PX;
  bottom?: PX;
}

type ActionButtonStyle<T> = T & {
  previousText?: string;
  nextText?: string;
  firstText?: string;
  lastText?: string;
};

export interface PaginationStyle<T> {
  container?: ContainerStyle;
  buttons?: T;
  activeButton?: T;
  disabledButtons?: CSSStyle; // disabled buttons do not have any mouse events
  actionButtons?: ActionButtonStyle<T>; // will also use 'buttons' style
}

export interface Pagination {
  numberOfEntries?: number; // by default set to 10
  maxNumberOfButtons?: number; // by default set to 8
  displayPrevNext?: boolean; // by default true
  displayFirstLast?: boolean; // by default true
  style?: PaginationStyle<StatefulCSSS>;
}
