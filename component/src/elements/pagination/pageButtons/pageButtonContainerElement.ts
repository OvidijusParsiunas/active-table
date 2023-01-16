import {Containers, PaginationContainerElement} from '../paginationContainer/paginationContainerElement';
import {PreviousPageButtonElement} from './buttons/prevNext/previousPageButtonElement';
import {FirstPageButtonElement} from './buttons/firstLast/firstPageButtonElement';
import {PageNumberButtonElement} from './buttons/number/pageNumberButtonElement';
import {LastPageButtonElement} from './buttons/firstLast/lastPageButtonElement';
import {NextPageButtonElement} from './buttons/prevNext/nextPageButtonElement';
import {PaginationUtils} from '../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {PageButtonContainerEvents} from './pageButtonContainerEvents';
import {PaginationInternal} from '../../../types/paginationInternal';
import {PageButtonElement} from './pageButtonElement';

export class PageButtonContainerElement {
  private static readonly PAGINATION_BUTTON_CONTAINER_ID = 'pagination-button-container';
  public static NUMBER_OF_ACTION_BUTTONS = 0;

  private static setStyle(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const minNumberOfButtonsToBeActive = etc.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader ? 1 : 2;
    if (etc.contents.length < minNumberOfButtonsToBeActive) {
      const {style} = etc.paginationInternal;
      PageButtonElement.setDisabled(buttonContainerElement, style.pageButtons);
    } else {
      PageButtonElement.setActive(etc, buttonContainerElement, 1);
    }
  }

  private static addNumberButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    // the reason why 1 button is required when it should be 0 is because we hide it and show it when a row is added
    const requiredNumberOfButtons = PaginationUtils.getLastPossiblePageNumber(etc);
    const {maxNumberOfVisiblePageButtons} = etc.paginationInternal;
    for (let i = 0; i < Math.min(requiredNumberOfButtons, maxNumberOfVisiblePageButtons); i += 1) {
      const buttonElement = PageNumberButtonElement.create(etc, i + 1);
      buttonContainerElement.appendChild(buttonElement);
    }
  }

  private static addButton(buttonContainerElement: HTMLElement, buttonElement: HTMLElement) {
    buttonContainerElement.appendChild(buttonElement);
    PageButtonContainerElement.NUMBER_OF_ACTION_BUTTONS += 1;
  }

  private static addButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    const {displayPrevNext, displayFirstLast} = etc.paginationInternal;
    if (displayFirstLast) {
      PageButtonContainerElement.addButton(buttonContainerElement, FirstPageButtonElement.create(etc));
    }
    if (displayPrevNext) {
      PageButtonContainerElement.addButton(buttonContainerElement, PreviousPageButtonElement.create(etc));
    }
    PageButtonContainerElement.addNumberButtons(etc, buttonContainerElement);
    if (displayPrevNext) {
      PageButtonContainerElement.addButton(buttonContainerElement, NextPageButtonElement.create(etc));
    }
    if (displayFirstLast) {
      PageButtonContainerElement.addButton(buttonContainerElement, LastPageButtonElement.create(etc));
    }
  }

  private static resetState(pagination: PaginationInternal) {
    pagination.activePageNumber = 1;
    PageButtonContainerElement.NUMBER_OF_ACTION_BUTTONS = 0;
  }

  public static repopulateButtons(etc: EditableTableComponent, buttonContainerElement: HTMLElement) {
    PageButtonContainerElement.resetState(etc.paginationInternal);
    buttonContainerElement.replaceChildren();
    PageButtonContainerElement.addButtons(etc, buttonContainerElement);
    PageButtonContainerElement.setStyle(etc, buttonContainerElement);
  }

  public static create(etc: EditableTableComponent, containers: Containers) {
    const buttonContainerElement = document.createElement('div');
    buttonContainerElement.id = PageButtonContainerElement.PAGINATION_BUTTON_CONTAINER_ID;
    const {style, positions} = etc.paginationInternal;
    buttonContainerElement.style.order = String(positions.pageButtons.order);
    Object.assign(buttonContainerElement.style, style.pageButtons.container);
    PageButtonContainerEvents.setEvents(buttonContainerElement, etc.paginationInternal);
    PageButtonContainerElement.repopulateButtons(etc, buttonContainerElement);
    PaginationContainerElement.addToContainer(positions.pageButtons.side, containers, buttonContainerElement);
    return buttonContainerElement;
  }
}
