import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationNextButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const {activeButtonNumber, buttonContainer, style} = this.paginationInternal;
    if (!buttonContainer || PaginationUtils.getLastPossibleButtonNumber(this) <= activeButtonNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, activeButtonNumber + 1);
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement, style, true);
  }

  public static setEvents(etc: EditableTableComponent, previousButtonElement: HTMLElement) {
    previousButtonElement.onmouseup = PaginationNextButtonEvents.buttonMouseUp.bind(etc);
  }
}
