import {EditableTableComponent} from '../../editable-table-component';
import {PaginationInternal} from '../../types/paginationInternal';
import {PaginationButtonEvents} from './paginationButtonEvents';
import {PaginationButtonStyle} from './paginationButtonStyle';

export class PaginationButtonElement {
  private static readonly PAGINATION_BUTTON_CLASS = 'pagination-button';
  private static readonly DISABLED_PAGINATION_BUTTON_CLASS = 'pagination-button-disabled';
  public static readonly ACTIVE_PAGINATION_BUTTON_CLASS = 'pagination-button-active';

  public static unsetDisabled(buttonElement: HTMLElement) {
    buttonElement.classList.replace(
      PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS,
      PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS
    );
    PaginationButtonStyle.setActive(buttonElement);
  }

  public static setDisabled(buttonElement: HTMLElement) {
    buttonElement.classList.replace(
      PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS,
      PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS
    );
    PaginationButtonStyle.setDisabled(buttonElement);
  }

  public static setActive(paginationInternal: PaginationInternal, buttonContainer: HTMLElement, buttonNumber: number) {
    const buttons = Array.from(buttonContainer.children) as HTMLElement[];
    const previousActive = buttons[paginationInternal.activeButtonNumber - 1];
    if (previousActive) previousActive.classList.remove(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    paginationInternal.activeButtonNumber = buttonNumber;
    const newActiveButton = buttons[buttonNumber - 1];
    newActiveButton.classList.add(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    PaginationButtonStyle.setActive(newActiveButton, previousActive);
  }

  public static create(etc: EditableTableComponent, buttonNumber: number) {
    const button = document.createElement('div');
    button.innerText = String(buttonNumber);
    button.classList.add(PaginationButtonElement.PAGINATION_BUTTON_CLASS);
    setTimeout(() => PaginationButtonEvents.setEvents(etc, button, buttonNumber));
    return button;
  }
}
