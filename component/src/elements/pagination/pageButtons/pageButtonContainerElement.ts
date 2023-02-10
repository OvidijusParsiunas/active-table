import {Containers, PaginationContainerElement} from '../paginationContainer/paginationContainerElement';
import {PaginationVisibleButtonsUtils} from '../../../utils/pagination/paginationVisibleButtonsUtils';
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

  private static setStyle(at: ActiveTable) {
    const minNumberOfButtonsToBeActive = at.dataStartsAtHeader ? 1 : 2;
    if (at.content.length < minNumberOfButtonsToBeActive) {
      PageButtonElement.setDisabled(at._pagination);
    } else {
      PageButtonElement.setActive(at, 1);
    }
  }

  private static addNumberButtons(at: ActiveTable) {
    // the reason why 1 button is required when it should be 0 is because we hide it and show it when a row is added
    const requiredNumberOfButtons = PaginationUtils.getLastPossiblePageNumber(at);
    const {maxNumberOfVisiblePageButtons, buttonContainer} = at._pagination;
    for (let i = 0; i < Math.min(requiredNumberOfButtons, maxNumberOfVisiblePageButtons); i += 1) {
      const buttonElement = PageNumberButtonElement.create(at, i + 1);
      buttonContainer.appendChild(buttonElement);
    }
  }

  private static addButton(pagination: PaginationInternal, button: HTMLElement) {
    pagination.buttonContainer.appendChild(button);
    pagination.numberOfActionButtons += 1;
  }

  private static addButtons(at: ActiveTable) {
    const {displayPrevNext, displayFirstLast} = at._pagination;
    if (displayFirstLast) {
      PageButtonContainerElement.addButton(at._pagination, FirstPageButtonElement.create(at));
    }
    if (displayPrevNext) {
      PageButtonContainerElement.addButton(at._pagination, PreviousPageButtonElement.create(at));
    }
    PageButtonContainerElement.addNumberButtons(at);
    if (displayPrevNext) {
      PageButtonContainerElement.addButton(at._pagination, NextPageButtonElement.create(at));
    }
    if (displayFirstLast) {
      PageButtonContainerElement.addButton(at._pagination, LastPageButtonElement.create(at));
    }
  }

  private static resetState(pagination: PaginationInternal) {
    pagination.activePageNumber = 1;
    pagination.numberOfActionButtons = 0;
    pagination.visibleEdgeButtons = [];
  }

  public static repopulateButtons(at: ActiveTable) {
    PageButtonContainerElement.resetState(at._pagination);
    at._pagination.buttonContainer.replaceChildren();
    PageButtonContainerElement.addButtons(at);
    PageButtonContainerElement.setStyle(at);
  }

  public static addInitialElements(at: ActiveTable, containers: Containers) {
    PageButtonContainerElement.repopulateButtons(at);
    PaginationVisibleButtonsUtils.setStateAndStyles(at);
    const {positions, buttonContainer} = at._pagination;
    PaginationContainerElement.addToContainer(positions.pageButtons.side, containers, buttonContainer);
  }

  public static create(at: ActiveTable) {
    const buttonContainerElement = document.createElement('div');
    buttonContainerElement.id = PageButtonContainerElement.PAGINATION_BUTTON_CONTAINER_ID;
    const {style, positions} = at._pagination;
    buttonContainerElement.style.order = String(positions.pageButtons.order);
    Object.assign(buttonContainerElement.style, style.pageButtons.container);
    PageButtonContainerEvents.setEvents(buttonContainerElement, at._pagination);
    return buttonContainerElement;
  }
}
