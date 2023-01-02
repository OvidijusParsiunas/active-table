import {PaginationUtils} from '../../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationLastButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    const {activeButtonNumber, style} = this.paginationInternal;
    PaginationButtonStyle.mouseEnter(buttonElement, style, true);
    const numberOfNumberButtons = PaginationUtils.getLastPossibleButtonNumber(this);
    if (numberOfNumberButtons <= activeButtonNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, numberOfNumberButtons);
  }

  public static setEvents(etc: EditableTableComponent, lastButtonElement: HTMLElement) {
    lastButtonElement.onmouseup = PaginationLastButtonEvents.buttonMouseUp.bind(etc);
  }
}
