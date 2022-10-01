import {OverwriteCellsViaCSVOnPaste} from '../../utils/pasteCSV/overwriteCellsViaCSVOnPaste';
import {FirefoxCaretDisplayFix} from '../../utils/browser/firefox/firefoxCaretDisplayFix';
import {CategoryDropdownItem} from '../dropdown/categoryDropdown/categoryDropdownItem';
import {CategoryDropdown} from '../dropdown/categoryDropdown/categoryDropdown';
import {CellTypeTotalsUtils} from '../../utils/cellType/cellTypeTotalsUtils';
import {FocusedCellUtils} from '../../utils/focusedCell/focusedCellUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {CELL_TYPE, VALIDABLE_CELL_TYPE} from '../../enums/cellType';
import {ValidateInput} from '../../utils/cellType/validateInput';
import {USER_SET_COLUMN_TYPE} from '../../enums/columnType';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';
import {Browser} from '../../utils/browser/browser';
import {Dropdown} from '../dropdown/dropdown';
import {CellElement} from './cellElement';
import {CellEvents} from './cellEvents';

export class DataCellEvents {
  private static readonly PASTE_INPUT_TYPE = 'insertFromPaste';
  private static readonly TEXT_DATA_FORMAT = 'text/plain';
  private static readonly INVALID_TEXT_COLOR = 'grey';
  private static readonly DEFAULT_TEXT_COLOR = '';

  // prettier-ignore
  private static setTextColorBasedOnValidity(cellElement: HTMLElement, userSetColumnType: VALIDABLE_CELL_TYPE) {
    cellElement.style.color = ValidateInput.validate(cellElement.textContent as string, userSetColumnType)
      ? DataCellEvents.DEFAULT_TEXT_COLOR : DataCellEvents.INVALID_TEXT_COLOR;
  }

  // TO-DO default types per column, cleanup e.g. currency or date will need to be provided by user
  // TO-DO allow user to set default as invalid
  // using this instead of keydown is because when this is fired the new cell text is available
  // prettier-ignore
  private static inputCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const inputEvent = event as InputEvent;
    const cellElement = inputEvent.target as HTMLElement;
    CellElement.processAndSetTextOnCell(cellElement, cellElement.textContent as string, false);
    const categoryDropdown = this.overlayElementsState.categoryDropdown as HTMLElement;
    const columnDetails = this.columnsDetails[columnIndex];
    if (inputEvent.inputType !== DataCellEvents.PASTE_INPUT_TYPE) {
      const userSetColumnType = columnDetails.userSetColumnType as keyof typeof VALIDABLE_CELL_TYPE;
      if (VALIDABLE_CELL_TYPE[userSetColumnType]) {
        DataCellEvents.setTextColorBasedOnValidity(cellElement, userSetColumnType);
      }
      if (Dropdown.isDisplayed(categoryDropdown)) {
        CategoryDropdownItem.focusMatchingCellCategoryItem(cellElement.textContent as string,
          categoryDropdown, columnDetails.categories.categoryDropdownItems);
      }
      CellEvents.updateCell(this, cellElement.textContent as string, rowIndex, columnIndex, {processText: false});
    }
  }

  private static keyDownCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    const {overlayElementsState, columnsDetails} = this;
    const categoryDropdown = overlayElementsState.categoryDropdown as HTMLElement;
    const columnDetails = columnsDetails[columnIndex];
    // WORK - Esc
    if (event.key === KEYBOARD_KEY.TAB) {
      if (columnDetails.userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
        CategoryDropdown.hideAndSetText(this, categoryDropdown);
      }
    } else if (event.key === KEYBOARD_KEY.ENTER) {
      if (columnDetails.userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
        event.preventDefault();
        CategoryDropdown.hideAndSetText(this, categoryDropdown);
        CategoryDropdownItem.focusOrBlurCellBelow(columnDetails.elements, rowIndex);
      }
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      if (Dropdown.isDisplayed(categoryDropdown)) {
        event.preventDefault();
        CategoryDropdownItem.highlightSiblingItem(columnDetails.categories.categoryDropdownItems, 'nextSibling');
      }
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      if (Dropdown.isDisplayed(categoryDropdown)) {
        event.preventDefault();
        CategoryDropdownItem.highlightSiblingItem(columnDetails.categories.categoryDropdownItems, 'previousSibling');
      }
    }
  }

  // WORK - add category on paste
  private static pasteCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: ClipboardEvent) {
    const clipboardText = JSON.stringify(event.clipboardData?.getData(DataCellEvents.TEXT_DATA_FORMAT));
    if (OverwriteCellsViaCSVOnPaste.isCSVData(clipboardText)) {
      OverwriteCellsViaCSVOnPaste.overwrite(this, clipboardText, event, rowIndex, columnIndex);
    } else {
      const cellElement = event.target as HTMLElement;
      setTimeout(() => {
        CellEvents.updateCell(this, cellElement.textContent as string, rowIndex, columnIndex, {processText: false});
      });
    }
  }

  // prettier-ignore
  private static blurCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const cellElement = event.target as HTMLElement;
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.blurCell(cellElement);
    CellEvents.setCellToDefaultIfNeeded(this, rowIndex, columnIndex, cellElement);
    cellElement.style.color = DataCellEvents.DEFAULT_TEXT_COLOR;
    const oldType = this.focusedCell.type as CELL_TYPE;
    setTimeout(() => {
      const newType = CellTypeTotalsUtils.parseType(cellElement.textContent as string, this.defaultCellValue);
      CellTypeTotalsUtils.changeCellTypeAndSetNewColumnType(this.columnsDetails[columnIndex], oldType, newType);
    });
  }

  // prettier-ignore
  private static focusCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const cellElement = event.target as HTMLElement;
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.focusCell(cellElement, rowIndex);
    // placed here and not in timeout because we need cells with a default value to be recorded before modification
    FocusedCellUtils.setDataCell(this.focusedCell, cellElement, rowIndex, columnIndex, this.defaultCellValue);
    CellEvents.removeTextIfCellDefault(this, rowIndex, columnIndex, event);
    if (this.columnsDetails[columnIndex].userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
      CategoryDropdown.display(this, columnIndex, cellElement);
    }
  }

  public static set(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    cellElement.oninput = DataCellEvents.inputCell.bind(etc, rowIndex, columnIndex);
    cellElement.onkeydown = DataCellEvents.keyDownCell.bind(etc, rowIndex, columnIndex);
    cellElement.onpaste = DataCellEvents.pasteCell.bind(etc, rowIndex, columnIndex);
    cellElement.onblur = DataCellEvents.blurCell.bind(etc, rowIndex, columnIndex);
    cellElement.onfocus = DataCellEvents.focusCell.bind(etc, rowIndex, columnIndex);
  }
}
