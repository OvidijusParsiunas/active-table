import {PaginationUtils} from '../../../../../utils/outerTableComponents/pagination/paginationUtils';
import {PaginationInternal} from '../../../../../types/paginationInternal';
import {ActiveTable} from '../../../../../activeTable';
import {PageButtonStyle} from '../../pageButtonStyle';

// WORK - row/column dropdowns don't close when clicking on pagination buttons
export class PageNumberButtonEvents {
  // REF-30
  private static markClick(pagination: PaginationInternal) {
    pagination.clickedPageNumberButton = true;
    setTimeout(() => (pagination.clickedPageNumberButton = false));
  }

  private static buttonMouseUp(this: ActiveTable, buttonNumber: number, event: MouseEvent) {
    PageNumberButtonEvents.markClick(this._pagination);
    const buttonElement = event.target as HTMLElement;
    const {pageButtons} = this._pagination.styles;
    if (this._pagination.activePageNumber === buttonNumber) {
      PageButtonStyle.mouseEnter(buttonElement, pageButtons, false);
    } else {
      PaginationUtils.displayRowsForDifferentButton(this, buttonNumber);
      // for the case when mouse clicks on a number button and no new buttons are created
      PageButtonStyle.mouseEnter(buttonElement, pageButtons, false);
    }
  }

  public static setEvents(at: ActiveTable, buttonNumber: number, buttonElement: HTMLElement) {
    buttonElement.onmouseup = PageNumberButtonEvents.buttonMouseUp.bind(at, buttonNumber);
  }
}
