import {StringDimension} from './dimensions';

export interface Overflow {
  maxWidth?: StringDimension;
  isScrollbarPartOfWidth?: boolean; // by default true
  maxHeight?: StringDimension;
  isScrollbarPartOfHeight?: boolean; // by default true
}
