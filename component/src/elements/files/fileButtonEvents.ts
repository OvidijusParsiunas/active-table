import {ElementStyle} from '../../utils/elements/elementStyle';
import {StatefulCSS} from '../../types/cssStyle';

export class FileButtonEvents {
  private static buttonMouseUp(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    ElementStyle.unsetAllCSSStates(buttonElement, buttonStyle);
    Object.assign(buttonElement.style, buttonStyle.default);
    Object.assign(buttonElement.style, buttonStyle.hover);
  }

  private static buttonMouseDown(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    Object.assign(buttonElement.style, buttonStyle.click);
  }

  private static buttonMouseLeave(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    ElementStyle.unsetAllCSSStates(buttonElement, buttonStyle);
    Object.assign(buttonElement.style, buttonStyle.default);
  }

  private static buttonMouseEnter(buttonStyle: StatefulCSS, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    Object.assign(buttonElement.style, buttonStyle.hover);
  }

  public static setStyleEvents(buttonElement: HTMLElement, buttonStyle: StatefulCSS) {
    buttonElement.onmouseenter = FileButtonEvents.buttonMouseEnter.bind(this, buttonStyle);
    buttonElement.onmouseleave = FileButtonEvents.buttonMouseLeave.bind(this, buttonStyle);
    buttonElement.onmousedown = FileButtonEvents.buttonMouseDown.bind(this, buttonStyle);
    buttonElement.onmouseup = FileButtonEvents.buttonMouseUp.bind(this, buttonStyle);
  }
}
