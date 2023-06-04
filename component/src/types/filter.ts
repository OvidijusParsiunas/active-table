import {OuterContentPosition} from './outerContainer';
import {CSSStyle, StatefulCSS} from './cssStyle';

export interface FilterStyles {
  container?: CSSStyle;
  placeholder?: {color: string};
  caseButton?: StatefulCSS & {active?: CSSStyle};
  dropdownArrow?: StatefulCSS & {active?: CSSStyle};
}

export interface Filter {
  caseButton?: boolean;
  dropdown?: boolean;
  defaultColumnHeaderName?: string;
  placeholderTemplate?: string;
  styles?: FilterStyles;
  position?: OuterContentPosition;
  order?: number;
}
