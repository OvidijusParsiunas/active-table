import {CSVButton, ImportOverwriteOptions} from './CSV';
import {StatefulCSS} from './cssStyle';

export type CSVButtonProps = Required<CSVButton<Required<StatefulCSS>>>;

export type ImportCSVButtonProps = CSVButtonProps & {overwriteOptions?: ImportOverwriteOptions};

export type ExportCSVButtonProps = CSVButtonProps & {fileName?: string};

export interface CSVButtonsInternal {
  import?: ImportCSVButtonProps;
  export?: ExportCSVButtonProps;
}

export interface CSVInternal {
  buttons?: CSVButtonsInternal;
  // always created as the user may want to trigger the importCSV method without the CSV buttons and need this to work
  inputElementRef: HTMLInputElement;
}
