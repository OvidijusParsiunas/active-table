import {CSVButtonProps} from '../../types/CSVInternal';
import {CSVButtonEvents} from './CSVButtonEvents';

export class CSVButtonElement {
  private static readonly CSV_BUTTON_CLASS = 'csv-button';

  public static create(buttonProps: CSVButtonProps) {
    const {text, styles, order} = buttonProps;
    const buttonElement = document.createElement('div');
    buttonElement.classList.add(CSVButtonElement.CSV_BUTTON_CLASS);
    buttonElement.textContent = text;
    buttonElement.style.order = String(order);
    Object.assign(buttonElement.style, styles.default);
    setTimeout(() => CSVButtonEvents.setEvents(buttonElement, styles));
    return buttonElement;
  }
}
