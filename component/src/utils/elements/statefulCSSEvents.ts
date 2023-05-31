import {StatefulCSS} from '../../types/cssStyle';
import {ElementStyle} from './elementStyle';

export class StatefulCSSEvents {
  private static mouseUp(styles: StatefulCSS, inactiveClass: string | undefined, element: HTMLElement) {
    if (inactiveClass && element.classList.contains(inactiveClass)) return;
    ElementStyle.unsetAllCSSStates(element, styles);
    Object.assign(element.style, styles.default);
    Object.assign(element.style, styles.hover);
  }

  private static mouseDown(styles: StatefulCSS, inactiveClass: string | undefined, element: HTMLElement) {
    if (inactiveClass && element.classList.contains(inactiveClass)) return;
    Object.assign(element.style, styles.click);
  }

  private static mouseLeave(styles: StatefulCSS, inactiveClass: string | undefined, element: HTMLElement) {
    if (inactiveClass && element.classList.contains(inactiveClass)) return;
    ElementStyle.unsetAllCSSStates(element, styles);
    Object.assign(element.style, styles.default);
  }

  private static mouseEnter(styles: StatefulCSS, inactiveClass: string | undefined, element: HTMLElement) {
    if (inactiveClass && element.classList.contains(inactiveClass)) return;
    Object.assign(element.style, styles.hover);
  }

  public static setEvents(element: HTMLElement, styles: StatefulCSS, inactiveClass?: string) {
    element.addEventListener('mouseenter', StatefulCSSEvents.mouseEnter.bind(this, styles, inactiveClass, element));
    element.addEventListener('mouseleave', StatefulCSSEvents.mouseLeave.bind(this, styles, inactiveClass, element));
    element.addEventListener('mousedown', StatefulCSSEvents.mouseDown.bind(this, styles, inactiveClass, element));
    element.addEventListener('mouseup', StatefulCSSEvents.mouseUp.bind(this, styles, inactiveClass, element));
  }
}
