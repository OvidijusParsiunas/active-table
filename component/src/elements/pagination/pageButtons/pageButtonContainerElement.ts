import {Containers, PaginationContainerElement} from '../paginationContainer/paginationContainerElement';
import {PreviousPageButtonElement} from './buttons/prevNext/previousPageButtonElement';
import {FirstPageButtonElement} from './buttons/firstLast/firstPageButtonElement';
import {PageNumberButtonElement} from './buttons/number/pageNumberButtonElement';
import {LastPageButtonElement} from './buttons/firstLast/lastPageButtonElement';
import {NextPageButtonElement} from './buttons/prevNext/nextPageButtonElement';
import {PaginationUtils} from '../../../utils/pagination/paginationUtils';
import {PageButtonContainerEvents} from './pageButtonContainerEvents';
import {PaginationInternal} from '../../../types/paginationInternal';
import {PageButtonElement} from './pageButtonElement';
import {ActiveTable} from '../../../activeTable';

export class PageButtonContainerElement {
  private static readonly PAGINATION_BUTTON_CONTAINER_ID = 'pagination-button-container';
  public static NUMBER_OF_ACTION_BUTTONS = 0;

  private static setStyle(at: ActiveTable, buttonContainerElement: HTMLElement) {
    const minNumberOfButtonsToBeActive = at.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader ? 1 : 2;
    if (at.content.length < minNumberOfButtonsToBeActive) {
      const {style} = at.paginationInternal;
      PageButtonElement.setDisabled(buttonContainerElement, style.pageButtons);
    } else {
      PageButtonElement.setActive(at, buttonContainerElement, 1);
    }
  }

  private static addNumberButtons(at: ActiveTable, buttonContainerElement: HTMLElement) {
    // the reason why 1 button is required when it should be 0 is because we hide it and show it when a row is added
    const requiredNumberOfButtons = PaginationUtils.getLastPossiblePageNumber(at);
    const {maxNumberOfVisiblePageButtons} = at.paginationInternal;
    for (let i = 0; i < Math.min(requiredNumberOfButtons, maxNumberOfVisiblePageButtons); i += 1) {
      const buttonElement = PageNumberButtonElement.create(at, i + 1);
      buttonContainerElement.appendChild(buttonElement);
    }
  }

  private static addButton(buttonContainerElement: HTMLElement, buttonElement: HTMLElement) {
    buttonContainerElement.appendChild(buttonElement);
    PageButtonContainerElement.NUMBER_OF_ACTION_BUTTONS += 1;
  }

  private static addButtons(at: ActiveTable, buttonContainerElement: HTMLElement) {
    const {displayPrevNext, displayFirstLast} = at.paginationInternal;
    if (displayFirstLast) {
      PageButtonContainerElement.addButton(buttonContainerElement, FirstPageButtonElement.create(at));
    }
    if (displayPrevNext) {
      PageButtonContainerElement.addButton(buttonContainerElement, PreviousPageButtonElement.create(at));
    }
    PageButtonContainerElement.addNumberButtons(at, buttonContainerElement);
    if (displayPrevNext) {
      PageButtonContainerElement.addButton(buttonContainerElement, NextPageButtonElement.create(at));
    }
    if (displayFirstLast) {
      PageButtonContainerElement.addButton(buttonContainerElement, LastPageButtonElement.create(at));
    }
  }

  private static resetState(pagination: PaginationInternal) {
    pagination.activePageNumber = 1;
    PageButtonContainerElement.NUMBER_OF_ACTION_BUTTONS = 0;
  }

  public static repopulateButtons(at: ActiveTable, buttonContainerElement: HTMLElement) {
    PageButtonContainerElement.resetState(at.paginationInternal);
    buttonContainerElement.replaceChildren();
    PageButtonContainerElement.addButtons(at, buttonContainerElement);
    PageButtonContainerElement.setStyle(at, buttonContainerElement);
  }

  public static create(at: ActiveTable, containers: Containers) {
    const buttonContainerElement = document.createElement('div');
    buttonContainerElement.id = PageButtonContainerElement.PAGINATION_BUTTON_CONTAINER_ID;
    const {style, positions} = at.paginationInternal;
    buttonContainerElement.style.order = String(positions.pageButtons.order);
    Object.assign(buttonContainerElement.style, style.pageButtons.container);
    PageButtonContainerEvents.setEvents(buttonContainerElement, at.paginationInternal);
    PageButtonContainerElement.repopulateButtons(at, buttonContainerElement);
    PaginationContainerElement.addToContainer(positions.pageButtons.side, containers, buttonContainerElement);
    return buttonContainerElement;
  }
}
