import {OuterContentPosition} from './outerContainer';
import {CSSStyle, StatefulCSS} from './cssStyle';

export interface CSVButton<T = StatefulCSS> {
  styles?: T;
  text?: string;
  position?: OuterContentPosition;
  order?: number;
}

export type ImportOverwriteOptions = {tableRowStartIndex?: number; importRowStartIndex?: number};

export interface CSVButtons {
  import?: (CSVButton & {overwriteOptions?: ImportOverwriteOptions}) | boolean;
  export?: (CSVButton & {fileName?: string}) | boolean;
}

export interface DragAndDrop {
  overlayStyle?: CSSStyle;
  overwriteOptions?: ImportOverwriteOptions;
}

export interface CSV {
  buttons?: CSVButtons;
  dragAndDrop?: DragAndDrop | boolean;
}
