import {EditableTableComponent} from '../../editable-table-component';
import {PaginationButtonElement} from './paginationButtonElement';
import {TableElement} from '../table/tableElement';

export class PaginationButtonContainer {
  private static readonly PAGINATION_BUTTON_CONTAINER_ID = 'pagination-button-container';
  private static readonly GAP = 10;

  private static addButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement, numberOfButtons: number) {
    for (let i = 0; i < numberOfButtons; i += 1) {
      const buttonElement = PaginationButtonElement.create(etc, i + 1);
      buttonContainerElement.appendChild(buttonElement);
    }
  }

  public static populateButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const {numberOfEntries} = etc.paginationInternal;
    const numberOfDataRows = Math.max(etc.contents.length - 1, 0);
    const numberOfButtons = Math.ceil(numberOfDataRows / numberOfEntries);
    PaginationButtonContainer.addButtons(etc, buttonContainerElement, numberOfButtons);
  }

  private static setHeight(buttonContainerElement: HTMLElement) {
    const bottomMargin =
      TableElement.BORDER_DIMENSIONS.bottomWidth + PaginationButtonContainer.GAP + buttonContainerElement.offsetHeight;
    buttonContainerElement.style.bottom = `-${bottomMargin}px`;
  }

  public static create(etc: EditableTableComponent) {
    const buttonContainerElement = document.createElement('div');
    buttonContainerElement.id = PaginationButtonContainer.PAGINATION_BUTTON_CONTAINER_ID;
    PaginationButtonContainer.populateButtons(etc, buttonContainerElement);
    setTimeout(() => PaginationButtonContainer.setHeight(buttonContainerElement));
    return buttonContainerElement;
  }
}
