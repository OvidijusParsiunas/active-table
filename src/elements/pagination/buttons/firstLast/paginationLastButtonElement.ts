import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationLastButtonEvents} from './paginationLastButtonEvents';
import {PaginationButtonElement} from '../../paginationButtonElement';

export class PaginationLastButtonElement {
  public static create(etc: EditableTableComponent) {
    const {style} = etc.paginationInternal;
    const lastButtonElement = PaginationButtonElement.create(style.actionButtons.lastText as string, style, true);
    setTimeout(() => PaginationLastButtonEvents.setEvents(etc, lastButtonElement));
    return lastButtonElement;
  }
}
