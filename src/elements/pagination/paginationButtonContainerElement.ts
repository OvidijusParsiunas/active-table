import {PaginationPreviousButtonElement} from './buttons/prevNext/paginationPreviousButtonElement';
import {PaginationFirstButtonElement} from './buttons/firstLast/paginationFirstButtonElement';
import {PaginationNumberButtonElement} from './buttons/number/paginationNumberButtonElement';
import {PaginationLastButtonElement} from './buttons/firstLast/paginationLastButtonElement';
import {PaginationNextButtonElement} from './buttons/prevNext/paginationNextButtonElement';
import {PaginationUpdateButtons} from '../../utils/pagination/paginationUpdateButtons';
import {EditableTableComponent} from '../../editable-table-component';
import {PaginationButtonElement} from './paginationButtonElement';
import {TableElement} from '../table/tableElement';

export class PaginationButtonContainerElement {
  private static readonly PAGINATION_BUTTON_CONTAINER_ID = 'pagination-button-container';
  private static readonly GAP = 10;
  public static NUMBER_OF_SIDE_BUTTONS = 0;

  private static addNumberButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const requiredNumberOfButtons = PaginationUpdateButtons.getExpectedNumberOfButtons(etc);
    const {maxNumberOfButtons} = etc.paginationInternal;
    const buttonsToAdd = requiredNumberOfButtons < maxNumberOfButtons ? requiredNumberOfButtons : maxNumberOfButtons;
    for (let i = 0; i < buttonsToAdd; i += 1) {
      const buttonElement = PaginationNumberButtonElement.create(etc, i + 1);
      buttonContainerElement.appendChild(buttonElement);
    }
  }

  private static addButton(buttonContainerElement: HTMLElement, buttonElement: HTMLElement) {
    buttonContainerElement.appendChild(buttonElement);
    PaginationButtonContainerElement.NUMBER_OF_SIDE_BUTTONS += 1;
  }

  private static populateButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const {displayPrevNext, displayFirstLast} = etc.paginationInternal;
    if (displayFirstLast) {
      PaginationButtonContainerElement.addButton(buttonContainerElement, PaginationFirstButtonElement.create(etc));
    }
    if (displayPrevNext) {
      PaginationButtonContainerElement.addButton(buttonContainerElement, PaginationPreviousButtonElement.create(etc));
    }
    PaginationButtonContainerElement.addNumberButtons(etc, buttonContainerElement);
    if (displayPrevNext) {
      PaginationButtonContainerElement.addButton(buttonContainerElement, PaginationNextButtonElement.create(etc));
    }
    if (displayFirstLast) {
      PaginationButtonContainerElement.addButton(buttonContainerElement, PaginationLastButtonElement.create(etc));
    }
    if (etc.contents.length < 2) {
      PaginationButtonElement.setDisabled(buttonContainerElement);
    } else {
      PaginationButtonElement.setActive(etc, buttonContainerElement, 1);
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
