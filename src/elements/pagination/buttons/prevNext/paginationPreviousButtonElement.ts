import {PaginationPreviousButtonEvents} from './paginationPreviousButtonEvents';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationButtonElement} from '../../paginationButtonElement';

export class PaginationPreviousButtonElement {
  public static create(etc: EditableTableComponent) {
    const previousButtonElement = PaginationButtonElement.create('&#60', etc.paginationInternal.style, true);
    setTimeout(() => PaginationPreviousButtonEvents.setEvents(etc, previousButtonElement));
    return previousButtonElement;
  }
}
