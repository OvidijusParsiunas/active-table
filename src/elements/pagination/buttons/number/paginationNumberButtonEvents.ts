import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationNumberButtonEvents {
  // REF-30
  private static markClick(paginationInternal: PaginationInternal) {
    paginationInternal.clickedNumberButton = true;
    setTimeout(() => (paginationInternal.clickedNumberButton = false));
  }

  private static buttonMouseUp(this: EditableTableComponent, buttonNumber: number, event: MouseEvent) {
    PaginationNumberButtonEvents.markClick(this.paginationInternal);
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
