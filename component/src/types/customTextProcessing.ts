import {NoDimensionCSSStyle} from './cssStyle';
import {CellText} from './tableContent';

export interface CustomTextProcessing {
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeTextFunc?: (cellText: string) => CellText;
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeStyleFunc?: (cellText: string) => NoDimensionCSSStyle;
}
