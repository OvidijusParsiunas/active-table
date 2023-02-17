import {ElementStyle} from '../../utils/elements/elementStyle';
import {StatefulCSS} from '../../types/cssStyle';

export class CSVButtonEvents {
  private static buttonMouseUp(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    ElementStyle.unsetAllCSSStates(buttonElement, buttonStyle);
    Object.assign(buttonElement.style, buttonStyle.hover);
  }

  private static buttonMouseDown(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    Object.assign(buttonElement.style, buttonStyle.click);
  }

  private static buttonMouseLeave(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    ElementStyle.unsetAllCSSStates(buttonElement, buttonStyle);
  }

  private static buttonMouseEnter(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    Object.assign(buttonElement.style, buttonStyle.hover);
  }

  public static setEvents(buttonElement: HTMLElement, buttonStyle: StatefulCSS) {
    buttonElement.onmouseenter = CSVButtonEvents.buttonMouseEnter.bind(this, buttonStyle);
    buttonElement.onmouseleave = CSVButtonEvents.buttonMouseLeave.bind(this, buttonStyle);
    buttonElement.onmousedown = CSVButtonEvents.buttonMouseDown.bind(this, buttonStyle);
    buttonElement.onmouseup = CSVButtonEvents.buttonMouseUp.bind(this, buttonStyle);
  }
}
