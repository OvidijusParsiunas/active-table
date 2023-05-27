import {CSSStyle} from './cssStyle';

export interface FilterRowsConfig {
  caseButton?: boolean | CSSStyle;
  dropdown?: boolean;
  defaultColumnHeaderName?: string;
  placeholderTemplate?: string;
}

export type FilterRows = boolean | FilterRowsConfig | FilterRowsConfig[];
