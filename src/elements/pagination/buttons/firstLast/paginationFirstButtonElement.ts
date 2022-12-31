import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationFirstButtonEvents} from './paginationFirstButtonEvents';
import {PaginationButtonElement} from '../../paginationButtonElement';

export class PaginationFirstButtonElement {
  public static create(etc: EditableTableComponent) {
    const firstButtonElement = PaginationButtonElement.create('&#8810', etc.paginationInternal.style, true);
    setTimeout(() => PaginationFirstButtonEvents.setEvents(etc, firstButtonElement));
    return firstButtonElement;
  }
}
