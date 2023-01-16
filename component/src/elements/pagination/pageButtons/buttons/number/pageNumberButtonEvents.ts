import {PaginationUtils} from '../../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {PaginationInternal} from '../../../../../types/paginationInternal';
import {PageButtonStyle} from '../../pageButtonStyle';

export class PageNumberButtonEvents {
  // REF-30
  private static markClick(paginationInternal: PaginationInternal) {
    paginationInternal.clickedPageNumberButton = true;
    setTimeout(() => (paginationInternal.clickedPageNumberButton = false));
  }

  private static buttonMouseUp(this: EditableTableComponent, buttonNumber: number, event: MouseEvent) {
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

  public static setEvents(etc: EditableTableComponent, buttonNumber: number, buttonElement: HTMLElement) {
    buttonElement.onmouseup = PageNumberButtonEvents.buttonMouseUp.bind(etc, buttonNumber);
  }
}
