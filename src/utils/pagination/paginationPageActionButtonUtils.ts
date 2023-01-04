import {PageButtonContainerElement} from '../../elements/pagination/pageButtons/pageButtonContainerElement';
import {IPageButtonsStyle, IPaginationStyle, PaginationInternal} from '../../types/paginationInternal';
import {PageButtonElement} from '../../elements/pagination/pageButtons/pageButtonElement';
import {PageButtonStyle} from '../../elements/pagination/pageButtons/pageButtonStyle';
import {PaginationUtils} from './paginationUtils';

export class PaginationPageActionButtonUtils {
  private static setButtonAsEnabled(button: HTMLElement, pageButtonStyle: IPageButtonsStyle) {
    PageButtonStyle.setDefault(button, pageButtonStyle, true);
    button.classList.remove(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
  }

  private static setButtonAsDisabled(button: HTMLElement, pageButtonStyle: IPageButtonsStyle) {
    PageButtonStyle.setDisabled(button, pageButtonStyle, true);
    button.classList.add(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
  }

  // prettier-ignore
  private static toggleRightButtons(buttons: HTMLElement[], halfOfActionButtons: number, pagination: PaginationInternal,
      buttonContainer: HTMLElement) {
    const {activePageNumber, style} = pagination;
    const numberButtons = PaginationUtils.getNumberButtons(buttonContainer);
    const callback = activePageNumber === Number(numberButtons[numberButtons.length - 1].innerText)
      ? PaginationPageActionButtonUtils.setButtonAsDisabled : PaginationPageActionButtonUtils.setButtonAsEnabled;
    const rightActionButtons = buttons.slice(buttons.length - halfOfActionButtons);
    rightActionButtons.forEach((button) => callback(button, style.pageButtons));
  }

  // prettier-ignore
  private static toggleLeftButtons(buttons: HTMLElement[],
      activePageNumber: number, halfOfActionButtons: number, paginationStyle: IPaginationStyle) {
    const callback = activePageNumber === 1
      ? PaginationPageActionButtonUtils.setButtonAsDisabled : PaginationPageActionButtonUtils.setButtonAsEnabled;
    const leftActionButtons = buttons.slice(0, halfOfActionButtons);
    leftActionButtons.forEach((button) => callback(button, paginationStyle.pageButtons));
  }

  public static toggleActionButtons(pagination: PaginationInternal, buttonContainer: HTMLElement) {
    const {activePageNumber, style} = pagination;
    const buttons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfActionButtons = PageButtonContainerElement.NUMBER_OF_ACTION_BUTTONS / 2;
    PaginationPageActionButtonUtils.toggleLeftButtons(buttons, activePageNumber, halfOfActionButtons, style);
    PaginationPageActionButtonUtils.toggleRightButtons(buttons, halfOfActionButtons, pagination, buttonContainer);
  }
}
