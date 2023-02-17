import {OuterContainerContentPosition} from './outerContainer';
import {StatefulCSS} from './cssStyle';

export type CSVRow = string[];

export type CSV = CSVRow[];

export interface CSVButtonStyle<T = StatefulCSS> {
  styles?: T;
  text?: string;
  position?: OuterContainerContentPosition;
  order?: number;
}

export interface CSVButtons {
  import?: CSVButtonStyle | boolean;
  export?: CSVButtonStyle | boolean;
}
