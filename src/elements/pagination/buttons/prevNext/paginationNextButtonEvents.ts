import {PaginationButtonContainerElement} from '../../paginationButtonContainerElement';
import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationButtonStyle} from '../../paginationButtonStyle';

export class PaginationNextButtonEvents {
  private static buttonMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    PaginationButtonStyle.mouseEnter(buttonElement);
    const {activeButtonNumber, buttonContainer} = this.paginationInternal;
    const numberOfLeftSideButtons = PaginationButtonContainerElement.NUMBER_OF_SIDE_BUTTONS;
    if (!buttonContainer || buttonContainer.children.length - numberOfLeftSideButtons <= activeButtonNumber) return;
    PaginationUtils.displayRowsForDifferentButton(this, activeButtonNumber + 1);
  }

  public static setEvents(etc: EditableTableComponent, previousButtonElement: HTMLElement) {
    previousButtonElement.onmouseup = PaginationNextButtonEvents.buttonMouseUp.bind(etc);
  }
}
