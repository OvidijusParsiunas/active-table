import {OuterContentPosition} from './outerContainer';
import {CSSStyle, StatefulCSS} from './cssStyle';

export interface FilterRowsStyles {
  container?: CSSStyle;
  placeholder?: {color: string};
  caseButton?: StatefulCSS & {active?: CSSStyle};
}

export interface FilterRowsConfig {
  caseButton?: boolean;
  dropdown?: boolean;
  defaultColumnHeaderName?: string;
  placeholderTemplate?: string;
  styles?: FilterRowsStyles;
  position?: OuterContentPosition;
  order?: number;
}

export type FilterRows = boolean | FilterRowsConfig | FilterRowsConfig[];
