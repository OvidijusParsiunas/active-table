import {PaginationSideButtonUtils} from '../../../../utils/pagination/paginationSideButtonUtils';
import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationFirstButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    PaginationSideButtonUtils.markClick(this.paginationInternal);
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement);
    if (this.paginationInternal.activeButtonNumber === 1) return;
    PaginationUtils.displayRowsForDifferentButton(this, 1);
  }

  public static setEvents(etc: EditableTableComponent, firstButtonElement: HTMLElement) {
    firstButtonElement.onmouseup = PaginationFirstButtonEvents.buttonMouseUp.bind(etc);
  }
}
