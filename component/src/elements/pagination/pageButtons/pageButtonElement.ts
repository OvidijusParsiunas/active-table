import {PaginationPageActionButtonUtils} from '../../../utils/pagination/paginationPageActionButtonUtils';
import {PaginationVisibleButtonsUtils} from '../../../utils/pagination/paginationVisibleButtonsUtils';
import {PaginationUpdatePageButtons} from '../../../utils/pagination/paginationUpdatePageButtons';
import {IPageButtonsStyle, PaginationInternal} from '../../../types/paginationInternal';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {PaginationUtils} from '../../../utils/pagination/paginationUtils';
import {PaginationElements} from '../paginationElements';
import {CellText} from '../../../types/tableContent';
import {PageButtonEvents} from './pageButtonEvents';
import {PageButtonStyle} from './pageButtonStyle';
import {ActiveTable} from '../../../activeTable';

export class PageButtonElement {
  private static readonly PAGINATION_BUTTON_CLASS = 'pagination-button';
  public static readonly DISABLED_PAGINATION_BUTTON_CLASS = 'pagination-button-disabled';
  public static readonly ACTIVE_PAGINATION_BUTTON_CLASS = 'pagination-button-active';

  public static unsetDisabled(pagination: PaginationInternal) {
    const numberButton = PaginationUtils.getPageNumberButtons(pagination)[0];
    PageButtonStyle.setActive(numberButton, pagination.style.pageButtons);
    numberButton.classList.replace(
      PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS,
      PageButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS
    );
  }

  public static setDisabled(pagination: PaginationInternal) {
    const {buttonContainer, style, numberOfActionButtons} = pagination;
    const buttons = Array.from(buttonContainer.children);
    for (let i = 0; i < numberOfActionButtons / 2; i += 1) {
      PageButtonStyle.setDisabled(buttons[i] as HTMLElement, style.pageButtons, true);
      PageButtonStyle.setDisabled(buttons[buttons.length - 1 - i] as HTMLElement, style.pageButtons, true);
    }
    const numberButton = PaginationUtils.getPageNumberButtons(pagination)[0];
    PageButtonStyle.setDisabled(numberButton, style.pageButtons, false);
    numberButton.classList.remove(PageButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    buttons.forEach((buttonElement) => {
      buttonElement.classList.add(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
    });
  }

  // prettier-ignore
  private static programmaticMouseEnterTrigger(numberButtons: HTMLElement[], pagination: PaginationInternal,
      previousLocationOfNewIndex: number) {
    const elementToBeHovered = numberButtons[previousLocationOfNewIndex];
    if (elementToBeHovered && !elementToBeHovered.classList.contains(PageButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS)) {
      PageButtonStyle.mouseEnter(elementToBeHovered, pagination.style.pageButtons, false);
      // REF-31
      pagination.programaticallyHoveredPageNumberButton = elementToBeHovered;
      setTimeout(() => delete pagination.programaticallyHoveredPageNumberButton);
    }
  }

  private static setNewActive(pagination: PaginationInternal, buttonNumber: number) {
    const numberButtons = PaginationUtils.getPageNumberButtons(pagination);
    const lastButtonNumber = Number(numberButtons[numberButtons.length - 1].innerText);
    const newActiveIndex = numberButtons.length - (lastButtonNumber - buttonNumber) - 1;
    const newActiveButton = numberButtons[newActiveIndex];
    newActiveButton.classList.add(PageButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    return {newActiveButton, numberButtons};
  }

  private static unsetPreviousActive(pagination: PaginationInternal, buttonNumber: number) {
    const numberButtons = PaginationUtils.getPageNumberButtons(pagination);
    const lastButtonNumber = Number(numberButtons[numberButtons.length - 1].innerText);
    const previousActiveIndex = numberButtons.length - (lastButtonNumber - pagination.activePageNumber) - 1;
    const previousActiveButton = numberButtons[previousActiveIndex];
    const previousLocationOfNewIndex = numberButtons.length - (lastButtonNumber - buttonNumber) - 1;
    if (previousActiveButton) {
      previousActiveButton.classList.remove(PageButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
      return {previousActiveButton, previousLocationOfNewIndex};
    }
    return {previousLocationOfNewIndex};
  }

  // prettier-ignore
  public static setActive(at: ActiveTable, buttonNumber: number) {
    const {paginationInternal} = at;
    const {style: {pageButtons}, clickedPageNumberButton} = paginationInternal;
    const {previousActiveButton, previousLocationOfNewIndex} = PageButtonElement.unsetPreviousActive(
      paginationInternal, buttonNumber);
    PaginationVisibleButtonsUtils.unsetStateAndStyles(at.paginationInternal);
    paginationInternal.activePageNumber = buttonNumber;
    PaginationUpdatePageButtons.updateOnNewActive(at);
    const {newActiveButton, numberButtons} = PageButtonElement.setNewActive(paginationInternal, buttonNumber);
    PageButtonStyle.setActive(newActiveButton, pageButtons, previousActiveButton);
    PaginationPageActionButtonUtils.toggleActionButtons(at);
    PaginationVisibleButtonsUtils.setStateAndStyles(paginationInternal);
    // REF-30
    if (clickedPageNumberButton) {
      PageButtonElement.programmaticMouseEnterTrigger(numberButtons, paginationInternal, previousLocationOfNewIndex);
    }
  }

  public static create(text: CellText, pageButtonsStyle: IPageButtonsStyle, isActionButton: boolean) {
    const button = document.createElement('div');
    button.classList.add(
      PageButtonElement.PAGINATION_BUTTON_CLASS,
      PaginationElements.PAGINATION_TEXT_COMPONENT_CLASS,
      GenericElementUtils.NOT_SELECTABLE_CLASS
    );
    button.innerHTML = String(text);
    PageButtonStyle.setDefault(button, pageButtonsStyle, isActionButton);
    setTimeout(() => PageButtonEvents.setEvents(button, pageButtonsStyle, isActionButton));
    return button;
  }
}
