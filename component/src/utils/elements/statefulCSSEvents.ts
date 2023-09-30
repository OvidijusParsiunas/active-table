import {CSSStyle, StatefulCSS} from '../../types/cssStyle';
import {ElementStyle} from './elementStyle';

export class StatefulCSSEvents {
  public static apply(styles: StatefulCSS, newStyle: CSSStyle | undefined, element: HTMLElement) {
    ElementStyle.unsetAllCSSStates(element, styles);
    Object.assign(element.style, newStyle);
  }

  private static mouseUp(styles: StatefulCSS, inactiveClass: string | undefined, element: HTMLElement) {
    if (inactiveClass && element.classList.contains(inactiveClass)) return;
    StatefulCSSEvents.apply(styles, styles.default, element);
    Object.assign(element.style, styles.hover);
  }

  private static mouseDown(styles: StatefulCSS, inactiveClass: string | undefined, element: HTMLElement) {
    if (inactiveClass && element.classList.contains(inactiveClass)) return;
    Object.assign(element.style, styles.click);
  }

  private static mouseLeave(styles: StatefulCSS, inactiveClass: string | undefined, element: HTMLElement) {
    if (inactiveClass && element.classList.contains(inactiveClass)) return;
    StatefulCSSEvents.apply(styles, styles.default, element);
  }

  private static mouseEnter(styles: StatefulCSS, inactiveClass: string | undefined, element: HTMLElement) {
    if (inactiveClass && element.classList.contains(inactiveClass)) return;
    Object.assign(element.style, styles.hover);
  }

  // can change the styling on another element by using the otherElement argument
  public static getEvents(element: HTMLElement, styles: StatefulCSS, inactiveClass?: string, otherElement?: HTMLElement) {
    const target = otherElement || element;
    return {
      mouseenter: StatefulCSSEvents.mouseEnter.bind(this, styles, inactiveClass, target),
      mouseleave: StatefulCSSEvents.mouseLeave.bind(this, styles, inactiveClass, target),
      mousedown: StatefulCSSEvents.mouseDown.bind(this, styles, inactiveClass, target),
      mouseup: StatefulCSSEvents.mouseUp.bind(this, styles, inactiveClass, target),
    };
  }

  public static setEvents(element: HTMLElement, styles: StatefulCSS, inactiveClass?: string, otherElement?: HTMLElement) {
    const events = StatefulCSSEvents.getEvents(element, styles, inactiveClass, otherElement);
    element.addEventListener('mouseenter', events.mouseenter);
    element.addEventListener('mouseleave', events.mouseleave);
    element.addEventListener('mousedown', events.mousedown);
    element.addEventListener('mouseup', events.mouseup);
    return events;
  }
}
