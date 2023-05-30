import {ElementStyle} from '../../elements/elementStyle';
import {CSSStyle} from '../../../types/cssStyle';

export class OuterDropdownButtonElement {
  // used to allow automatic control of button icon styling, buttons that do not have this have to control their styles
  public static readonly AUTO_STYLING = 'outer-container-button-auto-styling';

  public static readonly ACTIVE_BUTTON_ICON_CLASS = 'outer-container-icon-button-active';

  public static toggleIcon(button: HTMLElement, style: CSSStyle) {
    const isActive = !!button.classList.contains(OuterDropdownButtonElement.ACTIVE_BUTTON_ICON_CLASS);
    if (isActive) {
      button.classList.remove(OuterDropdownButtonElement.ACTIVE_BUTTON_ICON_CLASS);
      ElementStyle.unsetStyle(button, style);
      button.dispatchEvent(new MouseEvent('mouseenter'));
    } else {
      button.classList.add(OuterDropdownButtonElement.ACTIVE_BUTTON_ICON_CLASS);
      Object.assign(button.style, style);
    }
    return isActive;
  }
}
