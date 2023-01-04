import {EditableTableComponent} from '../../../../../editable-table-component';
import {LastPageButtonEvents} from './lastPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';

export class LastPageButtonElement {
  public static create(etc: EditableTableComponent) {
    const {pageButtons} = etc.paginationInternal.style;
    const lastButtonElement = PageButtonElement.create(pageButtons.actionButtons.lastText as string, pageButtons, true);
    setTimeout(() => LastPageButtonEvents.setEvents(etc, lastButtonElement));
    return lastButtonElement;
  }
}
