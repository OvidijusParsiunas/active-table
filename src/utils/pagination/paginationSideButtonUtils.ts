import {PaginationButtonContainerElement} from '../../elements/pagination/paginationButtonContainerElement';
import {PaginationButtonElement} from '../../elements/pagination/paginationButtonElement';
import {PaginationButtonStyle} from '../../elements/pagination/paginationButtonStyle';

export class PaginationSideButtonUtils {
  private static setButtonAsEnabled(button: HTMLElement) {
    button.classList.remove(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
    PaginationButtonStyle.unset(button);
  }

  private static setButtonAsDisabled(button: HTMLElement) {
    button.classList.add(PaginationButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
    PaginationButtonStyle.setDisabled(button);
  }

  // prettier-ignore
  private static toggleRightSideButtons(buttons: HTMLElement[], buttonNumber: number, halfOfSideButtons: number) {
    const callback = buttonNumber === buttons.length - PaginationButtonContainerElement.NUMBER_OF_SIDE_BUTTONS
      ? PaginationSideButtonUtils.setButtonAsDisabled : PaginationSideButtonUtils.setButtonAsEnabled;
    const rightSideButtons = buttons.slice(buttons.length - halfOfSideButtons);
    rightSideButtons.forEach((button) => callback(button));
  }

  // prettier-ignore
  private static toggleLeftSideButtons(buttons: HTMLElement[], buttonNumber: number, halfOfSideButtons: number) {
    const callback = buttonNumber === 1
      ? PaginationSideButtonUtils.setButtonAsDisabled : PaginationSideButtonUtils.setButtonAsEnabled;
    const leftSideButtons = buttons.slice(0, halfOfSideButtons);
    leftSideButtons.forEach((button) => callback(button));
  }

  public static toggleSideButtons(buttonContainer: HTMLElement, buttonNumber: number) {
    const buttons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfSideButtons = PaginationButtonContainerElement.NUMBER_OF_SIDE_BUTTONS / 2;
    PaginationSideButtonUtils.toggleLeftSideButtons(buttons, buttonNumber, halfOfSideButtons);
    PaginationSideButtonUtils.toggleRightSideButtons(buttons, buttonNumber, halfOfSideButtons);
  }
}
