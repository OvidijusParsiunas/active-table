import {FirstPageButtonEvents} from './firstPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';
import {ActiveTable} from '../../../../../activeTable';

export class FirstPageButtonElement {
  public static create(at: ActiveTable) {
    const {pageButtons} = at.paginationInternal.style;
    const firstButtonElement = PageButtonElement.create(pageButtons.actionButtons.firstText as string, pageButtons, true);
    setTimeout(() => FirstPageButtonEvents.setEvents(at, firstButtonElement));
    return firstButtonElement;
  }
}
