import {PaginationUtils} from '../../../../../utils/pagination/paginationUtils';
import {PaginationInternal} from '../../../../../types/paginationInternal';
import {ActiveTable} from '../../../../../activeTable';
import {PageButtonStyle} from '../../pageButtonStyle';

export class PageNumberButtonEvents {
  // REF-30
  private static markClick(pagination: PaginationInternal) {
    pagination.clickedPageNumberButton = true;
    setTimeout(() => (pagination.clickedPageNumberButton = false));
  }

  private static buttonMouseUp(this: ActiveTable, buttonNumber: number, event: MouseEvent) {
    PageNumberButtonEvents.markClick(this.paginationInternal);
    const buttonElement = event.target as HTMLElement;
    const {pageButtons} = this.paginationInternal.style;
    if (this.paginationInternal.activePageNumber === buttonNumber) {
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
