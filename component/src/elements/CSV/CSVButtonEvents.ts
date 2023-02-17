import {ElementStyle} from '../../utils/elements/elementStyle';
import {StatefulCSS} from '../../types/cssStyle';

export class CSVButtonEvents {
  public static clickInputElement(inputElement: HTMLInputElement) {
    inputElement.click();
  }

  private static buttonMouseLeave(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    ElementStyle.unsetAllCSSStates(buttonElement, buttonStyle);
  }

  private static buttonMouseEnter(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    Object.assign(buttonElement.style, buttonStyle.hover);
  }

  private static buttonMouseDown(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    Object.assign(buttonElement.style, buttonStyle.click);
  }

  public static setEvents(button: HTMLElement, buttonStyle: StatefulCSS) {
    button.onmousedown = CSVButtonEvents.buttonMouseDown.bind(this, buttonStyle);
    button.onmouseenter = CSVButtonEvents.buttonMouseEnter.bind(this, buttonStyle);
    button.onmouseleave = CSVButtonEvents.buttonMouseLeave.bind(this, buttonStyle);
  }
}
