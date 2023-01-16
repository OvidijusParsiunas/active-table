import {NextPageButtonEvents} from './nextPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';
import {ActiveTable} from '../../../../../activeTable';

export class NextPageButtonElement {
  // prettier-ignore
  public static create(at: ActiveTable) {
    const {pageButtons} = at.paginationInternal.style;
    const previousButtonElement = PageButtonElement.create(pageButtons.actionButtons.nextText as string,
      pageButtons, true);
    setTimeout(() => NextPageButtonEvents.setEvents(at, previousButtonElement));
    return previousButtonElement;
  }
}
