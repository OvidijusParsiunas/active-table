import {PaginationUtils} from '../../../../../utils/pagination/paginationUtils';
import {ActiveTable} from '../../../../../activeTable';
import {PageButtonStyle} from '../../pageButtonStyle';

export class LastPageButtonEvents {
  private static buttonMouseUp(this: ActiveTable, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    const {activePageNumber, style} = this._pagination;
    PageButtonStyle.mouseEnter(buttonElement, style.pageButtons, true);
    const numberOfNumberButtons = PaginationUtils.getLastPossiblePageNumber(this);
    if (numberOfNumberButtons <= activePageNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, numberOfNumberButtons);
  }

  public static setEvents(at: ActiveTable, lastButtonElement: HTMLElement) {
    lastButtonElement.onmouseup = LastPageButtonEvents.buttonMouseUp.bind(at);
  }
}
