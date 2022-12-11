import {CellText} from './tableContents';

export interface CustomTextProcessing {
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeText?: (cellText: string) => CellText;
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  changeStyle?: () => void;
}
