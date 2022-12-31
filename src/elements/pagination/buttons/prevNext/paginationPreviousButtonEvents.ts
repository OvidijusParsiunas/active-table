import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationPreviousButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const {activeButtonNumber, style} = this.paginationInternal;
    if (activeButtonNumber === 1) return;
    PaginationUtils.displayRowsForDifferentButton(this, activeButtonNumber - 1);
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement, style, true);
  }

  public static setEvents(etc: EditableTableComponent, previousButtonElement: HTMLElement) {
    previousButtonElement.onmouseup = PaginationPreviousButtonEvents.buttonMouseUp.bind(etc);
  }
}
