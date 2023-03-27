import {OuterContentPosition} from './outerContainer';
import {StatefulCSS} from './cssStyle';

export type CSVRow = string[];

export type CSV = CSVRow[];

export interface CSVButton<T = StatefulCSS> {
  styles?: T;
  text?: string;
  position?: OuterContentPosition;
  order?: number;
}

export interface CSVButtons {
  import?: CSVButton | boolean;
  export?: (CSVButton & {fileName?: string}) | boolean;
}
