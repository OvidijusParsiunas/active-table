import {PaginationInternal} from '../../types/paginationInternal';
import {PaginationButtonEvents} from './paginationButtonEvents';
import {PaginationButtonStyle} from './paginationButtonStyle';
import {CellText} from '../../types/tableContents';

export class PaginationButtonElement {
  private static readonly PAGINATION_BUTTON_CLASS = 'pagination-button';
  private static readonly DISABLED_PAGINATION_BUTTON_CLASS = 'pagination-button-disabled';
  public static readonly ACTIVE_PAGINATION_BUTTON_CLASS = 'pagination-button-active';

  public static unsetDisabled(buttonContainer: HTMLElement) {
    Array.from(buttonContainer.children).forEach((buttonElement) => {
      buttonElement.classList.remove(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
      PaginationButtonStyle.unset(buttonElement as HTMLElement);
    });
    const numberButton = buttonContainer.children[1] as HTMLElement;
    numberButton.classList.add(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    PaginationButtonStyle.setActive(numberButton);
  }

  public static setDisabled(buttonContainer: HTMLElement) {
    Array.from(buttonContainer.children).forEach((buttonElement) => {
      buttonElement.classList.add(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
      PaginationButtonStyle.setDisabled(buttonElement as HTMLElement);
    });
    const numberButton = buttonContainer.children[1] as HTMLElement;
    numberButton.classList.remove(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
  }

  public static setActive(paginationInternal: PaginationInternal, buttonContainer: HTMLElement, buttonNumber: number) {
    const buttons = Array.from(buttonContainer.children) as HTMLElement[];
    const previousActive = buttons[paginationInternal.activeButtonNumber];
    if (previousActive) previousActive.classList.remove(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    paginationInternal.activeButtonNumber = buttonNumber;
    const newActiveButton = buttons[buttonNumber];
    newActiveButton.classList.add(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    PaginationButtonStyle.setActive(newActiveButton, previousActive);
  }

  public static create(text: CellText) {
    const button = document.createElement('div');
    button.classList.add(PaginationButtonElement.PAGINATION_BUTTON_CLASS);
    button.innerHTML = String(text);
    setTimeout(() => PaginationButtonEvents.setEvents(button));
    return button;
  }
}
