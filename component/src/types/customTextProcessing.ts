import {CellText} from './tableContents';
import {CellCSSStyle} from './cssStyle';

export interface CustomTextProcessing {
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeText?: (cellText: string) => CellText;
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeStyle?: (cellText: string) => CellCSSStyle;
}
