import {PaginationUtils} from '../../../../../utils/outerTableComponents/pagination/paginationUtils';
import {ActiveTable} from '../../../../../activeTable';
import {PageButtonStyle} from '../../pageButtonStyle';

export class PreviousPageButtonEvents {
  private static buttonMouseUp(this: ActiveTable, event: MouseEvent) {
    const {activePageNumber, styles} = this._pagination;
    if (activePageNumber === 1) return;
    PaginationUtils.getAndApplyDataOnButtonClick(this, activePageNumber - 1);
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseEnter(buttonElement, styles.pageButtons, true);
  }

  public static setEvents(at: ActiveTable, previousButtonElement: HTMLElement) {
    previousButtonElement.onmouseup = PreviousPageButtonEvents.buttonMouseUp.bind(at);
  }
}
