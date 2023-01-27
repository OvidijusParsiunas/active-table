import {NoDimensionCSSStyle} from './cssStyle';

export interface TextValidation {
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  // the reason why cell text is a string is because when it is extracted from an element it comes out in a string format
  func?: (cellText: string) => boolean;
  setTextToDefaultOnFail?: boolean; // true by default
  failedStyle?: NoDimensionCSSStyle;
}
