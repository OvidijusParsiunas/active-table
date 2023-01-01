import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationFirstButtonEvents} from './paginationFirstButtonEvents';
import {PaginationButtonElement} from '../../paginationButtonElement';

export class PaginationFirstButtonElement {
  public static create(etc: EditableTableComponent) {
    const {style} = etc.paginationInternal;
    const firstButtonElement = PaginationButtonElement.create(style.actionButtons.firstText as string, style, true);
    setTimeout(() => PaginationFirstButtonEvents.setEvents(etc, firstButtonElement));
    return firstButtonElement;
  }
}
