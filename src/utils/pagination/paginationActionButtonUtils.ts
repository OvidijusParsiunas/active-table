import {PaginationButtonContainerElement} from '../../elements/pagination/paginationButtonContainerElement';
import {PaginationButtonElement} from '../../elements/pagination/paginationButtonElement';
import {PaginationButtonStyle} from '../../elements/pagination/paginationButtonStyle';
import {PaginationUtils} from './paginationUtils';

export class PaginationActionButtonUtils {
  private static setButtonAsEnabled(button: HTMLElement) {
    button.classList.remove(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
    PaginationButtonStyle.unset(button);
  }

  private static setButtonAsDisabled(button: HTMLElement) {
    button.classList.add(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
    PaginationButtonStyle.setDisabled(button);
  }

  // prettier-ignore
  private static toggleRightButtons(buttonContainer: HTMLElement,
      buttons: HTMLElement[], activeButtonNumber: number, halfOfActionButtons: number) {
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    const callback = activeButtonNumber === Number(numberButtons[numberButtons.length - 1].innerText)
      ? PaginationActionButtonUtils.setButtonAsDisabled : PaginationActionButtonUtils.setButtonAsEnabled;
    const rightActionButtons = buttons.slice(buttons.length - halfOfActionButtons);
    rightActionButtons.forEach((button) => callback(button));
  }

  // prettier-ignore
  private static toggleLeftButtons(buttons: HTMLElement[], activeButtonNumber: number, halfOfActionButtons: number) {
    const callback = activeButtonNumber === 1
      ? PaginationActionButtonUtils.setButtonAsDisabled : PaginationActionButtonUtils.setButtonAsEnabled;
    const leftActionButtons = buttons.slice(0, halfOfActionButtons);
    leftActionButtons.forEach((button) => callback(button));
  }

  public static toggleActionButtons(buttonContainer: HTMLElement, activeButtonNumber: number) {
    const buttons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfActionButtons = PaginationButtonContainerElement.NUMBER_OF_ACTION_BUTTONS / 2;
    PaginationActionButtonUtils.toggleLeftButtons(buttons, activeButtonNumber, halfOfActionButtons);
    PaginationActionButtonUtils.toggleRightButtons(buttonContainer, buttons, activeButtonNumber, halfOfActionButtons);
  }
}
