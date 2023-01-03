import {PaginationButtonContainerElement} from '../../buttonContainer/paginationButtonContainerElement';
import {NumberOfRowsOptionsButtonElement} from './numberOfRowsOptionsButtonElement';
import {PaginationUtils} from '../../../../utils/pagination/paginationUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {NumberOfRowsDropdownItem} from './numberOfRowsDropdownItem';

export class NumberOfRowsDropdownItemUtil {
  // prettier-ignore
  private static updateRowsAndPaginationComponents(etc: EditableTableComponent, optionsButton: HTMLElement,
      newNumberOfRows: string) {
    const {buttonContainer} = etc.paginationInternal;
    PaginationButtonContainerElement.repopulateButtons(etc, buttonContainer);
    NumberOfRowsOptionsButtonElement.updateButtonText(optionsButton, newNumberOfRows);
    PaginationUtils.displayRowsForDifferentButton(etc, 1);
  }

  private static getNewNumberOfRows(etc: EditableTableComponent, newNumberOfRows: string) {
    const {paginationInternal, contents, auxiliaryTableContentInternal} = etc;
    if (paginationInternal.isAllRowsOptionSelected) {
      return auxiliaryTableContentInternal.indexColumnCountStartsAtHeader ? contents.length : contents.length - 1;
    }
    return Number(newNumberOfRows);
  }

  public static setNewNumberOfRows(etc: EditableTableComponent, optionsButton: HTMLElement, newNumberOfRows: string) {
    etc.paginationInternal.isAllRowsOptionSelected =
      newNumberOfRows.toLocaleLowerCase() === NumberOfRowsDropdownItem.ALL_ITEM_TEXT;
    etc.paginationInternal.numberOfRows = NumberOfRowsDropdownItemUtil.getNewNumberOfRows(etc, newNumberOfRows);
    NumberOfRowsDropdownItemUtil.updateRowsAndPaginationComponents(etc, optionsButton, newNumberOfRows);
  }
}
