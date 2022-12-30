import {PaginationSideButtonUtils} from '../../../../utils/pagination/paginationSideButtonUtils';
import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationPreviousButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    PaginationSideButtonUtils.markClick(this.paginationInternal);
    const {activeButtonNumber} = this.paginationInternal;
    if (activeButtonNumber === 1) return;
    PaginationUtils.displayRowsForDifferentButton(this, activeButtonNumber - 1);
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement);
  }

  public static setEvents(etc: EditableTableComponent, previousButtonElement: HTMLElement) {
    previousButtonElement.onmouseup = PaginationPreviousButtonEvents.buttonMouseUp.bind(etc);
  }
}
