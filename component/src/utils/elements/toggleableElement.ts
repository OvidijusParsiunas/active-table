import {CSSStyle} from '../../types/cssStyle';
import {ElementStyle} from './elementStyle';

export class ToggleableElement {
  public static readonly ACTIVE_BUTTON_CLASS = 'toggleable-button-active';
  // used to allow automatic control of button icon styling, buttons that do not have this have to control their styles
  public static readonly AUTO_STYLING_CLASS = 'toggleable-button-auto-styling';

  private static set(button: HTMLElement, style: CSSStyle) {
    button.classList.add(ToggleableElement.ACTIVE_BUTTON_CLASS);
    Object.assign(button.style, style);
  }

  private static unset(button: HTMLElement, style: CSSStyle) {
    button.classList.remove(ToggleableElement.ACTIVE_BUTTON_CLASS);
    ElementStyle.unsetStyle(button, style);
  }

  public static toggleActive(button: HTMLElement, style: CSSStyle) {
    const isActive = !!button.classList.contains(ToggleableElement.ACTIVE_BUTTON_CLASS);
    if (isActive) {
      ToggleableElement.unset(button, style);
      button.dispatchEvent(new MouseEvent('mouseenter'));
    } else {
      ToggleableElement.set(button, style);
    }
    return isActive;
  }

  public static unsetActive(button: HTMLElement, style: CSSStyle) {
    const isActive = !!button.classList.contains(ToggleableElement.ACTIVE_BUTTON_CLASS);
    if (isActive) {
      ToggleableElement.unset(button, style);
      button.dispatchEvent(new MouseEvent('mouseleave'));
    }
  }

  public static setActive(button: HTMLElement, style: CSSStyle) {
    const isActive = !!button.classList.contains(ToggleableElement.ACTIVE_BUTTON_CLASS);
    if (!isActive) {
      ToggleableElement.set(button, style);
    }
  }
}
