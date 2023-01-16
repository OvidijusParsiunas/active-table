import {EditableTableComponent} from '../../../../../editable-table-component';
import {FirstPageButtonEvents} from './firstPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';

export class FirstPageButtonElement {
  public static create(etc: EditableTableComponent) {
    const {pageButtons} = etc.paginationInternal.style;
    const firstButtonElement = PageButtonElement.create(pageButtons.actionButtons.firstText as string, pageButtons, true);
    setTimeout(() => FirstPageButtonEvents.setEvents(etc, firstButtonElement));
    return firstButtonElement;
  }
}
