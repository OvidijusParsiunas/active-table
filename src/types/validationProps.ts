import {CSSStyle} from './cssStyle';

export interface ValidationProps {
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  func?: (cellText: string) => boolean;
  setToDefaultTextOnFailed?: boolean; // true by default
  failedValidationStyle?: CSSStyle;
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  customValidationStyleColors?: (cellText: string) => CSSStyle;
}
