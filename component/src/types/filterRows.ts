import {CSSStyle} from './cssStyle';

export type FilterRows =
  | boolean
  | {
      caseButton?: boolean | CSSStyle;
      dropdown?: boolean;
    };
