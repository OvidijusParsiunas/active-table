import {PaginationSideButtonUtils} from '../../utils/pagination/paginationSideButtonUtils';
import {PaginationUpdateButtons} from '../../utils/pagination/paginationUpdateButtons';
import {PaginationButtonContainerElement} from './paginationButtonContainerElement';
import {PaginationUtils} from '../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../editable-table-component';
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

  private static setNewActive(numberButtons: HTMLElement[], lastButtonNumber: number, buttonNumber: number) {
    const newActiveIndex = numberButtons.length - (lastButtonNumber - buttonNumber) - 1;
    const newActiveButton = numberButtons[newActiveIndex];
    newActiveButton.classList.add(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    return newActiveButton;
  }

  private static unsetPreviousActive(etc: EditableTableComponent, numberButtons: HTMLElement[], lastButtonNumber: number) {
    const previousActiveIndex = numberButtons.length - (lastButtonNumber - etc.paginationInternal.activeButtonNumber) - 1;
    const previousActiveButton = numberButtons[previousActiveIndex];
    if (previousActiveButton) {
      previousActiveButton.classList.remove(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
      return previousActiveButton;
    }
    return undefined;
  }

  public static setActive(etc: EditableTableComponent, buttonContainer: HTMLElement, buttonNumber: number) {
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    const lastButtonNumber = Number(numberButtons[numberButtons.length - 1].innerText);
    const previousActiveButton = PaginationButtonElement.unsetPreviousActive(etc, numberButtons, lastButtonNumber);
    etc.paginationInternal.activeButtonNumber = buttonNumber;
    const newActiveButton = PaginationButtonElement.setNewActive(numberButtons, lastButtonNumber, buttonNumber);
    PaginationButtonStyle.setActive(newActiveButton, previousActiveButton);
    PaginationUpdateButtons.updateOnNewActive(etc);
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
