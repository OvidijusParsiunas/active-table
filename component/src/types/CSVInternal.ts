import {StatefulCSS} from './cssStyle';
import {CSVButton} from './CSV';

export type CSVButtonProps = Required<CSVButton<Required<StatefulCSS>>>;

export type ExportCSVButtonProps = CSVButtonProps & {fileName?: string};

export interface CSVButtonsInternal {
  import?: CSVButtonProps;
  export?: ExportCSVButtonProps;
}

export interface CSVInternal {
  buttons?: CSVButtonsInternal;
  inputElementRef: HTMLInputElement;
}
