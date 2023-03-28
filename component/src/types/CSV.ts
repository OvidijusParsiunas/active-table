import {OuterContentPosition} from './outerContainer';
import {StatefulCSS} from './cssStyle';

export interface CSVButton<T = StatefulCSS> {
  styles?: T;
  text?: string;
  position?: OuterContentPosition;
  order?: number;
}

export type ImportOverwriteOptions = {tableRowStartIndex?: number; csvRowStartIndex?: number};

export interface CSVButtons {
  import?: (CSVButton & {overwriteOptions?: ImportOverwriteOptions}) | boolean;
  export?: (CSVButton & {fileName?: string}) | boolean;
}
