import {EditableTableComponent} from '../../../../../editable-table-component';
import {PageNumberButtonEvents} from './pageNumberButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';

export class PageNumberButtonElement {
  public static create(etc: EditableTableComponent, buttonNumber: number) {
    const buttonElement = PageButtonElement.create(buttonNumber, etc.paginationInternal.style.pageButtons, false);
    setTimeout(() => PageNumberButtonEvents.setEvents(etc, buttonNumber, buttonElement));
    return buttonElement;
  }
}
