import {PageButtonElement} from '../../elements/pagination/pageButtons/pageButtonElement';
import {PageButtonStyle} from '../../elements/pagination/pageButtons/pageButtonStyle';
import {IPageButtonsStyle, IPaginationStyle} from '../../types/paginationInternal';
import {PaginationUtils} from './paginationUtils';
import {ActiveTable} from '../../activeTable';

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
  private static toggleRightButtons(at: ActiveTable, buttons: HTMLElement[], halfOfActionButtons: number) {
    const {activePageNumber, style} = at.paginationInternal;
    const lastPageNumber = PaginationUtils.getLastPossiblePageNumber(at);
    const callback = activePageNumber === lastPageNumber
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

  public static toggleActionButtons(at: ActiveTable, buttonContainer: HTMLElement) {
    const {activePageNumber, style, numberOfActionButtons} = at.paginationInternal;
    const buttons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfActionButtons = numberOfActionButtons / 2;
    PaginationPageActionButtonUtils.toggleLeftButtons(buttons, activePageNumber, halfOfActionButtons, style);
    PaginationPageActionButtonUtils.toggleRightButtons(at, buttons, halfOfActionButtons);
  }
}
