import {PaginationPreviousButtonEvents} from './paginationPreviousButtonEvents';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {PaginationButtonElement} from '../../paginationButtonElement';

export class PaginationPreviousButtonElement {
  public static create(etc: EditableTableComponent) {
    const {style} = etc.paginationInternal;
    const previousButtonElement = PaginationButtonElement.create(style.actionButtons.previousText as string, style, true);
    setTimeout(() => PaginationPreviousButtonEvents.setEvents(etc, previousButtonElement));
    return previousButtonElement;
  }
}
