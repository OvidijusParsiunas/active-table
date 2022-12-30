import {PaginationSideButtonUtils} from '../../../../utils/pagination/paginationSideButtonUtils';
import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationLastButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    PaginationSideButtonUtils.markClick(this.paginationInternal);
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement);
    const {activeButtonNumber, buttonContainer} = this.paginationInternal;
    if (!buttonContainer) return;
    const numberOfNumberButtons = PaginationUtils.getLastPossibleButtonNumber(this);
    if (numberOfNumberButtons <= activeButtonNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, numberOfNumberButtons);
  }

  public static setEvents(etc: EditableTableComponent, lastButtonElement: HTMLElement) {
    lastButtonElement.onmouseup = PaginationLastButtonEvents.buttonMouseUp.bind(etc);
  }
}
