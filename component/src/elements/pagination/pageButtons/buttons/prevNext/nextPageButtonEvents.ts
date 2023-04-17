import {PaginationUtils} from '../../../../../utils/outerTableComponents/pagination/paginationUtils';
import {ActiveTable} from '../../../../../activeTable';
import {PageButtonStyle} from '../../pageButtonStyle';

export class NextPageButtonEvents {
  private static buttonMouseUp(this: ActiveTable, event: MouseEvent) {
    const {activePageNumber, styles} = this._pagination;
    if (PaginationUtils.getLastPossiblePageNumber(this) <= activePageNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, activePageNumber + 1);
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseEnter(buttonElement, styles.pageButtons, true);
  }

  public static setEvents(at: ActiveTable, previousButtonElement: HTMLElement) {
    previousButtonElement.onmouseup = NextPageButtonEvents.buttonMouseUp.bind(at);
  }
}
