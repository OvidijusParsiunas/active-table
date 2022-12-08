import {CSSStyle} from './cssStyle';

export interface ValidationProps {
  func?: (cellText: string) => boolean;
  setToDefaultTextOnFailed?: boolean; // true by default
  failedValidationStyle?: CSSStyle;
  customValidationStyleColors?: () => void;
}
