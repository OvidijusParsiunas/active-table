import {PaginationActionButtonUtils} from '../../utils/pagination/paginationActionButtonUtils';
import {PaginationUpdateButtons} from '../../utils/pagination/paginationUpdateButtons';
import {PaginationButtonContainerElement} from './paginationButtonContainerElement';
import {PaginationUtils} from '../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {IPaginationStyle} from '../../types/paginationInternal';
import {PaginationButtonEvents} from './paginationButtonEvents';
import {PaginationButtonStyle} from './paginationButtonStyle';
import {CellText} from '../../types/tableContents';

export class PaginationButtonElement {
  private static readonly PAGINATION_BUTTON_CLASS = 'pagination-button';
  public static readonly DISABLED_PAGINATION_BUTTON_CLASS = 'pagination-button-disabled';
  public static readonly ACTIVE_PAGINATION_BUTTON_CLASS = 'pagination-button-active';

  public static unsetDisabled(buttonContainer: HTMLElement, paginationStyle: IPaginationStyle) {
    const numberButton = PaginationUtils.getNumberButtons(buttonContainer)[0];
    PaginationButtonStyle.setActive(numberButton, paginationStyle);
    numberButton.classList.replace(
      PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS,
      PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS
    );
    if (PaginationButtonContainerElement.NUMBER_OF_ACTION_BUTTONS > 0) numberButton.style.display = '';
  }

  public static setDisabled(buttonContainer: HTMLElement, paginationStyle: IPaginationStyle) {
    const buttons = Array.from(buttonContainer.children);
    for (let i = 0; i < PaginationButtonContainerElement.NUMBER_OF_ACTION_BUTTONS / 2; i += 1) {
      PaginationButtonStyle.setDisabled(buttons[i] as HTMLElement, paginationStyle, true);
      PaginationButtonStyle.setDisabled(buttons[buttons.length - 1 - i] as HTMLElement, paginationStyle, true);
    }
    const numberButton = PaginationUtils.getNumberButtons(buttonContainer)[0];
    PaginationButtonStyle.setDisabled(numberButton, paginationStyle, false);
    numberButton.classList.remove(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    if (PaginationButtonContainerElement.NUMBER_OF_ACTION_BUTTONS > 0) numberButton.style.display = 'none';
    buttons.forEach((buttonElement) => {
      buttonElement.classList.add(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
    });
  }

  // prettier-ignore
  private static programmaticMouseEnterTrigger(numberButtons: HTMLElement[], paginationStyle: IPaginationStyle,
      previousLocationOfNewIndex: number) {
    const hoverNewElement = numberButtons[previousLocationOfNewIndex];
    if (hoverNewElement && !hoverNewElement.classList.contains(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS)) {
      PaginationButtonStyle.mouseEnter(hoverNewElement, paginationStyle, false);
    }
  }

  private static setNewActive(buttonContainer: HTMLElement, buttonNumber: number) {
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    const lastButtonNumber = Number(numberButtons[numberButtons.length - 1].innerText);
    const newActiveIndex = numberButtons.length - (lastButtonNumber - buttonNumber) - 1;
    const newActiveButton = numberButtons[newActiveIndex];
    newActiveButton.classList.add(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
    return {newActiveButton, numberButtons};
  }

  private static unsetPreviousActive(etc: EditableTableComponent, buttonContainer: HTMLElement, buttonNumber: number) {
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    const lastButtonNumber = Number(numberButtons[numberButtons.length - 1].innerText);
    const previousActiveIndex = numberButtons.length - (lastButtonNumber - etc.paginationInternal.activeButtonNumber) - 1;
    const previousActiveButton = numberButtons[previousActiveIndex];
    const previousLocationOfNewIndex = numberButtons.length - (lastButtonNumber - buttonNumber) - 1;
    if (previousActiveButton) {
      previousActiveButton.classList.remove(PaginationButtonElement.ACTIVE_PAGINATION_BUTTON_CLASS);
      return {previousActiveButton, previousLocationOfNewIndex};
    }
    return {previousLocationOfNewIndex};
  }

  // prettier-ignore
  public static setActive(etc: EditableTableComponent, buttonContainer: HTMLElement, buttonNumber: number) {
    const {previousActiveButton, previousLocationOfNewIndex} = PaginationButtonElement.unsetPreviousActive(
      etc, buttonContainer, buttonNumber);
    const {style, clickedNumberButton} = etc.paginationInternal;
    etc.paginationInternal.activeButtonNumber = buttonNumber;
    PaginationUpdateButtons.updateOnNewActive(etc);
    const {newActiveButton, numberButtons} = PaginationButtonElement.setNewActive(buttonContainer, buttonNumber);
    PaginationButtonStyle.setActive(newActiveButton, style, previousActiveButton);
    PaginationActionButtonUtils.toggleActionButtons(etc.paginationInternal, buttonContainer);
    // REF-30
    if (clickedNumberButton) {
      PaginationButtonElement.programmaticMouseEnterTrigger(numberButtons, style, previousLocationOfNewIndex);
    }
  }

  public static create(text: CellText, paginationStyle: IPaginationStyle, isActionButton: boolean) {
    const button = document.createElement('div');
    button.classList.add(PaginationButtonElement.PAGINATION_BUTTON_CLASS);
    button.innerHTML = String(text);
    PaginationButtonStyle.setDefault(button, paginationStyle, isActionButton);
    setTimeout(() => PaginationButtonEvents.setEvents(button, paginationStyle, isActionButton));
    return button;
  }
}
