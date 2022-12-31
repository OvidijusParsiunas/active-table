import {PaginationButtonContainerElement} from '../../elements/pagination/paginationButtonContainerElement';
import {PaginationButtonElement} from '../../elements/pagination/paginationButtonElement';
import {PaginationButtonStyle} from '../../elements/pagination/paginationButtonStyle';
import {IPaginationStyle, PaginationInternal} from '../../types/paginationInternal';
import {PaginationUtils} from './paginationUtils';

export class PaginationActionButtonUtils {
  private static setButtonAsEnabled(button: HTMLElement, paginationStyle: IPaginationStyle) {
    PaginationButtonStyle.setDefault(button, paginationStyle, true);
    button.classList.remove(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
  }

  private static setButtonAsDisabled(button: HTMLElement, paginationStyle: IPaginationStyle) {
    PaginationButtonStyle.setDisabled(button, paginationStyle, true);
    button.classList.add(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
  }

  // prettier-ignore
  private static toggleRightButtons(buttons: HTMLElement[], halfOfActionButtons: number, pagination: PaginationInternal,
      buttonContainer: HTMLElement) {
    const {activeButtonNumber, style} = pagination;
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer as HTMLElement);
    const callback = activeButtonNumber === Number(numberButtons[numberButtons.length - 1].innerText)
      ? PaginationActionButtonUtils.setButtonAsDisabled : PaginationActionButtonUtils.setButtonAsEnabled;
    const rightActionButtons = buttons.slice(buttons.length - halfOfActionButtons);
    rightActionButtons.forEach((button) => callback(button, style));
  }

  // prettier-ignore
  private static toggleLeftButtons(buttons: HTMLElement[],
      activeButtonNumber: number, halfOfActionButtons: number, paginationStyle: IPaginationStyle) {
    const callback = activeButtonNumber === 1
      ? PaginationActionButtonUtils.setButtonAsDisabled : PaginationActionButtonUtils.setButtonAsEnabled;
    const leftActionButtons = buttons.slice(0, halfOfActionButtons);
    leftActionButtons.forEach((button) => callback(button, paginationStyle));
  }

  // prettier-ignore
  public static toggleActionButtons(pagination: PaginationInternal, buttonContainer: HTMLElement) {
    const {activeButtonNumber, style} = pagination;
    if (!buttonContainer) return;
    const buttons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfActionButtons = PaginationButtonContainerElement.NUMBER_OF_ACTION_BUTTONS / 2;
    PaginationActionButtonUtils.toggleLeftButtons(buttons, activeButtonNumber, halfOfActionButtons, style);
    PaginationActionButtonUtils.toggleRightButtons(buttons, halfOfActionButtons, pagination, buttonContainer);
  }
}
