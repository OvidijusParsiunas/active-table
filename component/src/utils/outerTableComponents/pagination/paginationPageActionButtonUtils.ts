import {PageButtonElement} from '../../../elements/pagination/pageButtons/pageButtonElement';
import {PageButtonStyle} from '../../../elements/pagination/pageButtons/pageButtonStyle';
import {IPageButtonsStyles, IPaginationStyles} from '../../../types/paginationInternal';
import {PaginationUtils} from './paginationUtils';
import {ActiveTable} from '../../../activeTable';

export class PaginationPageActionButtonUtils {
  private static setButtonAsEnabled(button: HTMLElement, pageButtonStyles: IPageButtonsStyles) {
    PageButtonStyle.setDefault(button, pageButtonStyles, true);
    button.classList.remove(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
  }

  private static setButtonAsDisabled(button: HTMLElement, pageButtonStyles: IPageButtonsStyles) {
    PageButtonStyle.setDisabled(button, pageButtonStyles, true);
    button.classList.add(PageButtonElement.DISABLED_PAGINATION_BUTTON_CLASS);
  }

  // prettier-ignore
  private static toggleRightButtons(at: ActiveTable, buttons: HTMLElement[], halfOfActionButtons: number) {
    const {activePageNumber, styles} = at._pagination;
    const lastPageNumber = PaginationUtils.getLastPossiblePageNumber(at);
    const callback = activePageNumber === lastPageNumber
      ? PaginationPageActionButtonUtils.setButtonAsDisabled : PaginationPageActionButtonUtils.setButtonAsEnabled;
    const rightActionButtons = buttons.slice(buttons.length - halfOfActionButtons);
    rightActionButtons.forEach((button) => callback(button, styles.pageButtons));
  }

  // prettier-ignore
  private static toggleLeftButtons(buttons: HTMLElement[],
      activePageNumber: number, halfOfActionButtons: number, paginationStyle: IPaginationStyles) {
    const callback = activePageNumber === 1
      ? PaginationPageActionButtonUtils.setButtonAsDisabled : PaginationPageActionButtonUtils.setButtonAsEnabled;
    const leftActionButtons = buttons.slice(0, halfOfActionButtons);
    leftActionButtons.forEach((button) => callback(button, paginationStyle.pageButtons));
  }

  public static toggleActionButtons(at: ActiveTable) {
    const {activePageNumber, styles, numberOfActionButtons, buttonContainer} = at._pagination;
    const buttons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfActionButtons = numberOfActionButtons / 2;
    PaginationPageActionButtonUtils.toggleLeftButtons(buttons, activePageNumber, halfOfActionButtons, styles);
    PaginationPageActionButtonUtils.toggleRightButtons(at, buttons, halfOfActionButtons);
  }
}
