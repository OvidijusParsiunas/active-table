import {PageNumberButtonEvents} from './pageNumberButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';
import {ActiveTable} from '../../../../../activeTable';

export class PageNumberButtonElement {
  public static create(at: ActiveTable, buttonNumber: number) {
    const buttonElement = PageButtonElement.create(at._pagination.styles.pageButtons, false);
    buttonElement.innerHTML = String(buttonNumber);
    setTimeout(() => PageNumberButtonEvents.setEvents(at, buttonNumber, buttonElement));
    return buttonElement;
  }
}
