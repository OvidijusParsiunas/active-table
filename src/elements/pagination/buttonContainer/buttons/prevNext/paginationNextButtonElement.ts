import {EditableTableComponent} from '../../../../../editable-table-component';
import {PaginationNextButtonEvents} from './paginationNextButtonEvents';
import {PaginationButtonElement} from '../../paginationButtonElement';

export class PaginationNextButtonElement {
  public static create(etc: EditableTableComponent) {
    const {style} = etc.paginationInternal;
    const previousButtonElement = PaginationButtonElement.create(style.actionButtons.nextText as string, style, true);
    setTimeout(() => PaginationNextButtonEvents.setEvents(etc, previousButtonElement));
    return previousButtonElement;
  }
}
