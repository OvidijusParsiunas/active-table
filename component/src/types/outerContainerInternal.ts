import {CSSStyle} from './cssStyle';

export interface OuterContainerDropdownI {
  button: HTMLElement;
  element: HTMLElement;
  activeButtonStyle: CSSStyle;
  hide: () => void;
}
