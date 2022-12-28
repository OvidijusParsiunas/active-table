import {PaginationUtils} from '../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../editable-table-component';

export class PaginationButtonEvents {
  private static buttonMouseLeave(event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    buttonElement.style.backgroundColor = '';
  }

  private static buttonMouseEnter(event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    buttonElement.style.backgroundColor = 'orange';
  }

  private static buttonMouseUp(this: EditableTableComponent, buttonNumber: number, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    buttonElement.style.backgroundColor = 'orange';
    const {paginationInternal} = this;
    if (paginationInternal.activeButtonNumber === buttonNumber) return;
    paginationInternal.activeButtonNumber = buttonNumber;
    PaginationUtils.displayRowsForDifferentButton(this, buttonNumber);
  }

  private static buttonMouseDown(event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    buttonElement.style.backgroundColor = 'red';
  }

  public static setEvents(etc: EditableTableComponent, button: HTMLElement, buttonNumber: number) {
    button.onmousedown = PaginationButtonEvents.buttonMouseDown;
    button.onmouseup = PaginationButtonEvents.buttonMouseUp.bind(etc, buttonNumber);
    button.onmouseenter = PaginationButtonEvents.buttonMouseEnter;
    button.onmouseleave = PaginationButtonEvents.buttonMouseLeave;
  }
}
