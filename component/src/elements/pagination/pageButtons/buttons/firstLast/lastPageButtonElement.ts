import {LastPageButtonEvents} from './lastPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';
import {ActiveTable} from '../../../../../activeTable';

export class LastPageButtonElement {
  public static create(at: ActiveTable) {
    const {pageButtons} = at.paginationInternal.style;
    const lastButtonElement = PageButtonElement.create(pageButtons.actionButtons.lastText as string, pageButtons, true);
    setTimeout(() => LastPageButtonEvents.setEvents(at, lastButtonElement));
    return lastButtonElement;
  }
}
