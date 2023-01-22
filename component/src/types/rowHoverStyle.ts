import {CSSStyle} from './cssStyle';

export interface RowHoverStyle {
  style: CSSStyle;
  header?: boolean; // by default true
  addNewRowButton?: boolean; // by default true
}
