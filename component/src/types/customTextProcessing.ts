import {CellText} from './tableContent';
import {CellCSSStyle} from './cssStyle';

export interface CustomTextProcessing {
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeTextFunc?: (cellText: string) => CellText;
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeStyleFunc?: (cellText: string) => CellCSSStyle;
}
