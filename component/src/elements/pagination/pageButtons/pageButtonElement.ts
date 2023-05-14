// eslint-disable-next-line max-len
import {PaginationPageActionButtonUtils} from '../../../utils/outerTableComponents/pagination/paginationPageActionButtonUtils';
import {PaginationVisibleButtonsUtils} from '../../../utils/outerTableComponents/pagination/paginationVisibleButtonsUtils';
import {PaginationUpdatePageButtons} from '../../../utils/outerTableComponents/pagination/paginationUpdatePageButtons';
import {PaginationUtils} from '../../../utils/outerTableComponents/pagination/paginationUtils';
import {IPageButtonsStyles, PaginationInternal} from '../../../types/paginationInternal';
import {GenericElementUtils} from '../../../utils/elements/genericElementUtils';
import {PaginationElements} from '../paginationElements';
import {PageButtonEvents} from './pageButtonEvents';
import {PageButtonStyle} from './pageButtonStyle';
import {ActiveTable} from '../../../activeTable';

export class PageButtonElement {
  private static readonly PAGINATION_BUTTON_CLASS = 'pagination-button';
  public static readonly DISABLED_PAGINATION_BUTTON_CLASS = 'pagination-button-disabled';
  public static readonly ACTIVE_PAGINATION_BUTTON_CLASS = 'pagination-button-active';
  public static readonly PRECEDENCE_ACTIVE_PAGINATION_BUTTON_CLASS = 'pagination-button-active-precedence';

  public static unsetDisabled(pagination: PaginationInternal) {
    const numberButton = PaginationUtils.getPageNumberButtons(pagination)[0];
    const {pageButtons} = pagination.styles;
    PageButtonStyle.setActive(numberButton, pageButtons);
    numberButton.classList.replace(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS, pageButtons.activeButtonClass);
  }

  public static setDisabled(pagination: PaginationInternal) {
    const {buttonContainer, styles, numberOfActionButtons} = pagination;
    const buttons = Array.from(buttonContainer.children);
    for (let i = 0; i < numberOfActionButtons / 2; i += 1) {
      PageButtonStyle.setDisabled(buttons[i] as HTMLElement, styles.pageButtons, true);
      PageButtonStyle.setDisabled(buttons[buttons.length - 1 - i] as HTMLElement, styles.pageButtons, true);
    }
    const numberButton = PaginationUtils.getPageNumberButtons(pagination)[0];
    PageButtonStyle.setDisabled(numberButton, styles.pageButtons, false);
    numberButton.classList.remove(styles.pageButtons.activeButtonClass);
    buttons.forEach((buttonElement) => {
      buttonElement.classList.add(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
    });
  }

  // prettier-ignore
  private static programmaticMouseEnterTrigger(numberButtons: HTMLElement[], pagination: PaginationInternal,
      previousLocationOfNewIndex: number) {
    const elementToBeHovered = numberButtons[previousLocationOfNewIndex];
    const {pageButtons} = pagination.styles;
    if (elementToBeHovered && !elementToBeHovered.classList.contains(pageButtons.activeButtonClass)) {
      PageButtonStyle.mouseEnter(elementToBeHovered, pageButtons, false);
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
    newActiveButton.classList.add(pagination.styles.pageButtons.activeButtonClass);
    return {newActiveButton, numberButtons};
  }

  private static unsetPreviousActive(pagination: PaginationInternal, buttonNumber: number) {
    const numberButtons = PaginationUtils.getPageNumberButtons(pagination);
    const lastButtonNumber = Number(numberButtons[numberButtons.length - 1].innerText);
    const previousActiveIndex = numberButtons.length - (lastButtonNumber - pagination.activePageNumber) - 1;
    const previousActiveButton = numberButtons[previousActiveIndex];
    const previousLocationOfNewIndex = numberButtons.length - (lastButtonNumber - buttonNumber) - 1;
    if (previousActiveButton) {
      previousActiveButton.classList.remove(pagination.styles.pageButtons.activeButtonClass);
      return {previousActiveButton, previousLocationOfNewIndex};
    }
    return {previousLocationOfNewIndex};
  }

  // prettier-ignore
  public static setActive(at: ActiveTable, buttonNumber: number) {
    const {_pagination} = at;
    const {styles: {pageButtons}, clickedPageNumberButton} = _pagination;
    const {previousActiveButton, previousLocationOfNewIndex} = PageButtonElement.unsetPreviousActive(
      _pagination, buttonNumber);
    PaginationVisibleButtonsUtils.unsetStateAndStyles(at._pagination);
    _pagination.activePageNumber = buttonNumber;
    PaginationUpdatePageButtons.updateOnNewActive(at);
    const {newActiveButton, numberButtons} = PageButtonElement.setNewActive(_pagination, buttonNumber);
    PageButtonStyle.setActive(newActiveButton, pageButtons, previousActiveButton);
    PaginationPageActionButtonUtils.toggleActionButtons(at);
    PaginationVisibleButtonsUtils.setStateAndStyles(at);
    // REF-30
    if (clickedPageNumberButton) {
      PageButtonElement.programmaticMouseEnterTrigger(numberButtons, _pagination, previousLocationOfNewIndex);
    }
  }

  public static create(pageButtonsStyles: IPageButtonsStyles, isActionButton: boolean) {
    const button = document.createElement('div');
    button.classList.add(
      PageButtonElement.PAGINATION_BUTTON_CLASS,
      PaginationElements.PAGINATION_TEXT_COMPONENT_CLASS,
      GenericElementUtils.NOT_SELECTABLE_CLASS
    );
    PageButtonStyle.setDefault(button, pageButtonsStyles, isActionButton);
    setTimeout(() => PageButtonEvents.setEvents(button, pageButtonsStyles, isActionButton));
    return button;
  }
}
