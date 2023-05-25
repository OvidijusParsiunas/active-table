import {CSSStyle} from './cssStyle';

export interface FilterRowsConfig {
  caseButton?: boolean | CSSStyle;
  dropdown?: boolean;
  defaultColumnHeaderName?: string;
}

export type FilterRows = boolean | FilterRowsConfig | FilterRowsConfig[];
