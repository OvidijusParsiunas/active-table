import {PaginationUtils} from '../../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {PageButtonStyle} from '../../pageButtonStyle';

export class PreviousPageButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const {activePageNumber, style} = this.paginationInternal;
    if (activePageNumber === 1) return;
    PaginationUtils.displayRowsForDifferentButton(this, activePageNumber - 1);
    const buttonElement = event.target as HTMLElement;
    PageButtonStyle.mouseEnter(buttonElement, style.pageButtons, true);
  }

  public static setEvents(etc: EditableTableComponent, previousButtonElement: HTMLElement) {
    previousButtonElement.onmouseup = PreviousPageButtonEvents.buttonMouseUp.bind(etc);
  }
}
