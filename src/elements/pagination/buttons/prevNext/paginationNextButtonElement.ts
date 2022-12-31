import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationNextButtonEvents} from './paginationNextButtonEvents';
import {PaginationButtonElement} from '../../paginationButtonElement';

export class PaginationNextButtonElement {
  public static create(etc: EditableTableComponent) {
    const previousButtonElement = PaginationButtonElement.create('&#62', etc.paginationInternal.style, true);
    setTimeout(() => PaginationNextButtonEvents.setEvents(etc, previousButtonElement));
    return previousButtonElement;
  }
}
