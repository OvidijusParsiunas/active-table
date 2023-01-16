import {EditableTableComponent} from '../../../../../editable-table-component';
import {PreviousPageButtonEvents} from './previousPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';

export class PreviousPageButtonElement {
  // prettier-ignore
  public static create(etc: EditableTableComponent) {
    const {pageButtons} = etc.paginationInternal.style;
    const previousButtonElement = PageButtonElement.create(pageButtons.actionButtons.previousText as string,
      pageButtons, true);
    setTimeout(() => PreviousPageButtonEvents.setEvents(etc, previousButtonElement));
    return previousButtonElement;
  }
}
