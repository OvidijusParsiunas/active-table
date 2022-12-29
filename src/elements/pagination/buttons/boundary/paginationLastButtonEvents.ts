import {PaginationButtonContainerElement} from '../../paginationButtonContainerElement';
import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationLastButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement);
    const {activeButtonNumber, buttonContainer} = this.paginationInternal;
    const sideButtonsNumber = PaginationButtonContainerElement.NUMBER_OF_SIDE_BUTTONS;
    if (!buttonContainer || buttonContainer.children.length - sideButtonsNumber <= activeButtonNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, buttonContainer.children.length - sideButtonsNumber);
  }

  public static setEvents(etc: EditableTableComponent, lastButtonElement: HTMLElement) {
    lastButtonElement.onmouseup = PaginationLastButtonEvents.buttonMouseUp.bind(etc);
  }
}
