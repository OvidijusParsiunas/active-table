import {EditableTableComponent} from '../../../../../editable-table-component';
import {NextPageButtonEvents} from './nextPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';

export class NextPageButtonElement {
  // prettier-ignore
  public static create(etc: EditableTableComponent) {
    const {pageButtons} = etc.paginationInternal.style;
    const previousButtonElement = PageButtonElement.create(pageButtons.actionButtons.nextText as string,
      pageButtons, true);
    setTimeout(() => NextPageButtonEvents.setEvents(etc, previousButtonElement));
    return previousButtonElement;
  }
}
