import {PaginationUtils} from '../../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {PageButtonStyle} from '../../pageButtonStyle';

export class LastPageButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    const {activePageNumber, style} = this.paginationInternal;
    PageButtonStyle.mouseEnter(buttonElement, style.pageButtons, true);
    const numberOfNumberButtons = PaginationUtils.getLastPossiblePageNumber(this);
    if (numberOfNumberButtons <= activePageNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, numberOfNumberButtons);
  }

  public static setEvents(etc: EditableTableComponent, lastButtonElement: HTMLElement) {
    lastButtonElement.onmouseup = LastPageButtonEvents.buttonMouseUp.bind(etc);
  }
}
