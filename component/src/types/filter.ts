import {OuterContentPosition} from './outerContainer';
import {CSSStyle, StatefulCSS} from './cssStyle';

export interface FilterStyles {
  input?: CSSStyle;
  placeholderColor?: string;
  caseIcon?: StatefulCSS & {active?: CSSStyle};
  dropdownIcon?: StatefulCSS & {active?: CSSStyle};
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
