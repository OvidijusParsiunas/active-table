import {PaginationUtils} from '../../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {PageButtonStyle} from '../../pageButtonStyle';

export class NextPageButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const {activePageNumber, style} = this.paginationInternal;
    if (PaginationUtils.getLastPossiblePageNumber(this) <= activePageNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, activePageNumber + 1);
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseEnter(buttonElement, style.pageButtons, true);
  }

  public static setEvents(etc: EditableTableComponent, previousButtonElement: HTMLElement) {
    previousButtonElement.onmouseup = NextPageButtonEvents.buttonMouseUp.bind(etc);
  }
}
