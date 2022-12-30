import {PaginationSideButtonUtils} from '../../utils/pagination/paginationSideButtonUtils';
import {PaginationButtonContainerElement} from './paginationButtonContainerElement';
import {PaginationUtils} from '../../utils/pagination/paginationUtils';
import {PaginationInternal} from '../../types/paginationInternal';
import {PaginationButtonEvents} from './paginationButtonEvents';
import {PaginationButtonStyle} from './paginationButtonStyle';
import {CellText} from '../../types/tableContents';

export class PaginationButtonElement {
  private static readonly PAGINATION_BUTTON_CLASS = 'pagination-button';
  public static readonly DISABLED_PAGINATION_BUTTON_CLASS = 'pagination-button-disabled';
  public static readonly ACTIVE_PAGINATION_BUTTON_CLASS = 'pagination-button-active';

  public static unsetDisabled(buttonContainer: HTMLElement) {
    const numberButton = PaginationUtils.getNumberButtons(buttonContainer)[0];
    numberButton.classList.replace(
      PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS,
      PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS
    );
    PaginationButtonStyle.unset(numberButton as HTMLElement);
    PaginationButtonStyle.setActive(numberButton);
    if (PaginationButtonContainerElement.NUMBER_OF_SIDE_BUTTONS > 0) numberButton.style.display = '';
  }

  public static setDisabled(buttonContainer: HTMLElement) {
    Array.from(buttonContainer.children).forEach((buttonElement) => {
      buttonElement.classList.add(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
      PaginationButtonStyle.setDisabled(buttonElement as HTMLElement);
    });
    const numberButton = PaginationUtils.getNumberButtons(buttonContainer)[0];
    numberButton.classList.remove(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    if (PaginationButtonContainerElement.NUMBER_OF_SIDE_BUTTONS > 0) numberButton.style.display = 'none';
  }

  public static setActive(paginationInternal: PaginationInternal, buttonContainer: HTMLElement, buttonNumber: number) {
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    const previousActive = numberButtons[paginationInternal.activeButtonNumber - 1];
    if (previousActive) previousActive.classList.remove(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    paginationInternal.activeButtonNumber = buttonNumber;
    const newActiveButton = numberButtons[buttonNumber - 1];
    newActiveButton.classList.add(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    PaginationButtonStyle.setActive(newActiveButton, previousActive);
    PaginationSideButtonUtils.toggleSideButtons(buttonContainer, buttonNumber);
  }

  public static create(text: CellText) {
    const button = document.createElement('div');
    button.classList.add(PaginationButtonElement.PAGINATION_BUTTON_CLASS);
    button.innerHTML = String(text);
    setTimeout(() => PaginationButtonEvents.setEvents(button));
    return button;
  }
}
