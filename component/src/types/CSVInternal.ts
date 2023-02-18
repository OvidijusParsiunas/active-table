import {StatefulCSS} from './cssStyle';
import {CSVButton} from './CSV';

export type CSVButtonProps = Required<CSVButton<Required<StatefulCSS>>>;

export interface CSVButtonsInternal {
  import?: CSVButtonProps;
  export?: CSVButtonProps;
}

export interface CSVInternal {
  buttons?: CSVButtonsInternal;
  inputElementRef: HTMLInputElement;
}
