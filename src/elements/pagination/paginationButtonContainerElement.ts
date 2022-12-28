import {PaginationUpdateButtons} from '../../utils/pagination/paginationUpdateButtons';
import {EditableTableComponent} from '../../editable-table-component';
import {PaginationButtonElement} from './paginationButtonElement';
import {TableElement} from '../table/tableElement';

export class PaginationButtonContainerElement {
  private static readonly PAGINATION_BUTTON_CONTAINER_ID = 'pagination-button-container';
  private static readonly GAP = 10;

  private static addButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const numberOfButtons = PaginationUpdateButtons.getExpectedNumberOfButtons(etc);
    for (let i = 0; i < Math.max(numberOfButtons, 1); i += 1) {
      const buttonElement = PaginationButtonElement.create(etc, i + 1);
      buttonContainerElement.appendChild(buttonElement);
    }
  }

  private static populateButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    PaginationButtonContainerElement.addButtons(etc, buttonContainerElement);
    if (etc.contents.length < 2) {
      const buttonElement = buttonContainerElement.children[0] as HTMLElement;
      buttonElement.classList.add(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
    }
  }

  private static setHeight(buttonContainerElement: HTMLElement) {
    const bottomMargin =
      TableElement.BORDER_DIMENSIONS.bottomWidth +
      PaginationButtonContainerElement.GAP +
      buttonContainerElement.offsetHeight;
    buttonContainerElement.style.bottom = `-${bottomMargin}px`;
  }

  public static create(etc: EditableTableComponent) {
    const buttonContainerElement = document.createElement('div');
    buttonContainerElement.id = PaginationButtonContainerElement.PAGINATION_BUTTON_CONTAINER_ID;
    PaginationButtonContainerElement.populateButtons(etc, buttonContainerElement);
    // need to wait for border to be set and visible
    setTimeout(() => PaginationButtonContainerElement.setHeight(buttonContainerElement));
    return buttonContainerElement;
  }
}
