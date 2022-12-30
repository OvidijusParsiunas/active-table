import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationLastButtonEvents} from './paginationLastButtonEvents';
import {PaginationButtonElement} from '../../paginationButtonElement';

export class PaginationLastButtonElement {
  public static create(etc: EditableTableComponent) {
    const lastButtonElement = PaginationButtonElement.create('&#8811');
    setTimeout(() => PaginationLastButtonEvents.setEvents(etc, lastButtonElement));
    return lastButtonElement;
  }
}
