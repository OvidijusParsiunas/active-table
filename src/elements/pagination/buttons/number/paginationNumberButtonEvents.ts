import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationNumberButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, buttonNumber: number, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement);
    const {paginationInternal} = this;
    if (paginationInternal.activeButtonNumber === buttonNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, buttonNumber);
  }

  public static setEvents(etc: EditableTableComponent, buttonNumber: number, buttonElement: HTMLElement) {
    buttonElement.onmouseup = PaginationNumberButtonEvents.buttonMouseUp.bind(etc, buttonNumber);
  }
}
