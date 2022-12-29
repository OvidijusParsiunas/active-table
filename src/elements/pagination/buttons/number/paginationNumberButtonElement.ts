import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationNumberButtonEvents} from './paginationNumberButtonEvents';
import {PaginationButtonElement} from '../../paginationButtonElement';

export class PaginationNumberButtonElement {
  public static create(etc: EditableTableComponent, buttonNumber: number) {
    const buttonElement = PaginationButtonElement.create(buttonNumber);
    setTimeout(() => PaginationNumberButtonEvents.setEvents(etc, buttonNumber, buttonElement));
    return buttonElement;
  }
}
