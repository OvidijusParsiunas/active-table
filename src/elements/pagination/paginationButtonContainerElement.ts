import {PaginationPreviousButtonElement} from './buttons/prevNext/paginationPreviousButtonElement';
import {PaginationNumberButtonElement} from './buttons/number/paginationNumberButtonElement';
import {PaginationNextButtonElement} from './buttons/prevNext/paginationNextButtonElement';
import {PaginationUpdateButtons} from '../../utils/pagination/paginationUpdateButtons';
import {EditableTableComponent} from '../../editable-table-component';
import {PaginationButtonElement} from './paginationButtonElement';
import {TableElement} from '../table/tableElement';

export class PaginationButtonContainerElement {
  private static readonly PAGINATION_BUTTON_CONTAINER_ID = 'pagination-button-container';
  private static readonly GAP = 10;

  private static addNumberButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const numberOfButtons = PaginationUpdateButtons.getExpectedNumberOfButtons(etc);
    for (let i = 0; i < Math.max(numberOfButtons, 1); i += 1) {
      const buttonElement = PaginationNumberButtonElement.create(etc, i + 1);
      buttonContainerElement.appendChild(buttonElement);
    }
  }

  private static populateButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const previousButton = PaginationPreviousButtonElement.create(etc);
    buttonContainerElement.appendChild(previousButton);
    PaginationButtonContainerElement.addNumberButtons(etc, buttonContainerElement);
    if (etc.contents.length < 2) {
      PaginationButtonElement.setDisabled(buttonContainerElement);
    } else {
      PaginationButtonElement.setActive(etc.paginationInternal, buttonContainerElement, 1);
    }
    const nextButton = PaginationNextButtonElement.create(etc);
    buttonContainerElement.appendChild(nextButton);
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
