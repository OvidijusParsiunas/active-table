import {PaginationUtils} from '../../../../../utils/outerTableComponents/pagination/paginationUtils';
import {ActiveTable} from '../../../../../activeTable';
import {PageButtonStyle} from '../../pageButtonStyle';

export class FirstPageButtonEvents {
  private static buttonMouseUp(this: ActiveTable, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseEnter(buttonElement, this._pagination.style.pageButtons, true);
    if (this._pagination.activePageNumber === 1) return;
    PaginationUtils.displayRowsForDifferentButton(this, 1);
  }

  public static setEvents(at: ActiveTable, firstButtonElement: HTMLElement) {
    firstButtonElement.onmouseup = FirstPageButtonEvents.buttonMouseUp.bind(at);
  }
}
