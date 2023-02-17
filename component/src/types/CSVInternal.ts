import {StatefulCSS} from './cssStyle';
import {CSVButtonStyle} from './CSV';

export type CSVButtonProps = Required<CSVButtonStyle<Required<StatefulCSS>>>;

export interface CSVButtonsInternal {
  import?: CSVButtonProps;
  export?: CSVButtonProps;
}
