import {NoDimensionCSSStyle} from './cssStyle';
import {CellText} from './tableData';

export interface CustomTextProcessing {
  // for attributes - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeTextFunc?: (cellText: string, rowIndex: number) => CellText;
  // for attributes - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeStyleFunc?: (cellText: string, rowIndex: number) => NoDimensionCSSStyle;
}
