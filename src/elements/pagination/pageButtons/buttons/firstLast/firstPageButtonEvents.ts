import {PaginationUtils} from '../../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {PageButtonStyle} from '../../pageButtonStyle';

export class FirstPageButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseEnter(buttonElement, this.paginationInternal.style.pageButtons, true);
    if (this.paginationInternal.activePageNumber === 1) return;
    PaginationUtils.displayRowsForDifferentButton(this, 1);
  }

  public static setEvents(etc: EditableTableComponent, firstButtonElement: HTMLElement) {
    firstButtonElement.onmouseup = FirstPageButtonEvents.buttonMouseUp.bind(etc);
  }
}
