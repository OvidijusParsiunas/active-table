import {PaginationUtils} from '../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {PaginationButtonStyle} from './paginationButtonStyle';

export class PaginationButtonEvents {
  private static buttonMouseLeave(event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseLeave(buttonElement);
  }

  private static buttonMouseEnter(event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement);
  }

  private static buttonMouseUp(this: EditableTableComponent, buttonNumber: number, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement);
    const {paginationInternal} = this;
    if (paginationInternal.activeButtonNumber === buttonNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, buttonNumber);
  }

  private static buttonMouseDown(event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseDown(buttonElement);
  }

  public static setEvents(etc: EditableTableComponent, button: HTMLElement, buttonNumber: number) {
    button.onmousedown = PaginationButtonEvents.buttonMouseDown;
    button.onmouseup = PaginationButtonEvents.buttonMouseUp.bind(etc, buttonNumber);
    button.onmouseenter = PaginationButtonEvents.buttonMouseEnter;
    button.onmouseleave = PaginationButtonEvents.buttonMouseLeave;
  }
}
