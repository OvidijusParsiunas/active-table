import {PreviousPageButtonEvents} from './previousPageButtonEvents';
import {PageButtonElement} from '../../pageButtonElement';
import {ActiveTable} from '../../../../../activeTable';

export class PreviousPageButtonElement {
  // prettier-ignore
  public static create(at: ActiveTable) {
    const {pageButtons} = at._pagination.styles;
    const previousButtonElement = PageButtonElement.create(pageButtons.actionButtons.previousText as string,
      pageButtons, true);
    setTimeout(() => PreviousPageButtonEvents.setEvents(at, previousButtonElement));
    return previousButtonElement;
  }
}
