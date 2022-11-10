import {OverwriteCellsViaCSVOnPaste} from '../../../utils/paste/CSV/overwriteCellsViaCSVOnPaste';
import {FirefoxCaretDisplayFix} from '../../../utils/browser/firefox/firefoxCaretDisplayFix';
import {CategoryDropdownItem} from '../../dropdown/categoryDropdown/categoryDropdownItem';
import {UserKeyEventsStateUtil} from '../../../utils/userEventsState/userEventsStateUtil';
import {DateCellInputElement} from '../cellsWithTextDiv/dateCell/dateCellInputElement';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {CellTypeTotalsUtils} from '../../../utils/cellType/cellTypeTotalsUtils';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_TYPE, VALIDABLE_CELL_TYPE} from '../../../enums/cellType';
import {ValidateInput} from '../../../utils/cellType/validateInput';
import {USER_SET_COLUMN_TYPE} from '../../../enums/columnType';
import {KEYBOARD_EVENT} from '../../../consts/keyboardEvents';
import {PasteUtils} from '../../../utils/paste/pasteUtils';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {UNDO_INPUT_TYPE} from '../../../consts/domEvents';
import {Browser} from '../../../utils/browser/browser';
import {CellElement} from '../cellElement';
import {CellEvents} from '../cellEvents';

export class DataCellEvents {
  private static readonly INVALID_TEXT_COLOR = 'grey';
  private static readonly DEFAULT_TEXT_COLOR = '';

  public static keyDownCell(this: EditableTableComponent, event: KeyboardEvent) {
    // REF-7
    if (event.key === KEYBOARD_KEY.TAB) {
      UserKeyEventsStateUtil.temporarilyIndicateEvent(this.userKeyEventsState, KEYBOARD_KEY.TAB);
    }
  }

  // prettier-ignore
  private static setTextColorBasedOnValidity(textContainerElement: HTMLElement, userSetColumnType: VALIDABLE_CELL_TYPE) {
    textContainerElement.style.color =
      ValidateInput.validate(textContainerElement.textContent as string, userSetColumnType)
        ? DataCellEvents.DEFAULT_TEXT_COLOR : DataCellEvents.INVALID_TEXT_COLOR;
  }

  // TO-DO default types per column, cleanup e.g. currency or date will need to be provided by user
  // TO-DO allow user to set default as invalid
  // using this instead of keydown because when this is fired the new cell text is available
  // prettier-ignore
  private static inputCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const inputEvent = event as InputEvent;
    // can be cell element for data cell, text element for category and date cells, or even input element from date picker
    // which is not processed here as its textContent property value is empty and the date value needs to be processed
    const textContainerElement = inputEvent.target as HTMLElement;
    if (DateCellInputElement.isInputElement(textContainerElement)) return;
    const text = textContainerElement.textContent as string;
    // sanitizePastedTextContent causes inputType to no longer be insertFromPaste, hence using this instead
    if (!this.userKeyEventsState[KEYBOARD_EVENT.PASTE]) {
      const isUndo = inputEvent.inputType === UNDO_INPUT_TYPE;
      CellElement.processAndSetTextOnCell(this, textContainerElement, text, isUndo, false);
      const columnDetails = this.columnsDetails[columnIndex];
      const userSetColumnType = columnDetails.userSetColumnType as keyof typeof VALIDABLE_CELL_TYPE;
      if (VALIDABLE_CELL_TYPE[userSetColumnType]) {
        DataCellEvents.setTextColorBasedOnValidity(textContainerElement, userSetColumnType);
      } else if (columnDetails.userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
        CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(textContainerElement, columnDetails.categoryDropdown,
          this.defaultCellValue, true);
      }
      CellEvents.updateCell(this, text, rowIndex, columnIndex, {processText: false});
    }
  }

  private static updatePastedCellIfCategory(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    const {userSetColumnType, categoryDropdown: dropdown} = etc.columnsDetails[columnIndex];
    if (userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
      CategoryDropdownItem.attemptHighlightMatchingCellCategoryItem(cellElement, dropdown, etc.defaultCellValue, true);
    }
  }

  private static pasteCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: ClipboardEvent) {
    UserKeyEventsStateUtil.temporarilyIndicateEvent(this.userKeyEventsState, KEYBOARD_EVENT.PASTE);
    PasteUtils.sanitizePastedTextContent(event);
    const clipboardText = PasteUtils.extractClipboardText(event);
    if (OverwriteCellsViaCSVOnPaste.isCSVData(clipboardText)) {
      OverwriteCellsViaCSVOnPaste.overwrite(this, clipboardText, event, rowIndex, columnIndex);
    } else {
      const cellElement = event.target as HTMLElement;
      setTimeout(() => {
        DataCellEvents.updatePastedCellIfCategory(this, cellElement, columnIndex);
        CellEvents.updateCell(this, cellElement.textContent as string, rowIndex, columnIndex, {processText: false});
      });
    }
  }

  // prettier-ignore
  // textContainerElement can be cell element for data cell, text element for category and date cells
  public static blur(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, textContainerElement: HTMLElement) {
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.removeContentEditable(textContainerElement);
    CellEvents.setCellToDefaultIfNeeded(etc, rowIndex, columnIndex, textContainerElement);
    textContainerElement.style.color = DataCellEvents.DEFAULT_TEXT_COLOR;
    const oldType = etc.focusedElements.cell.type as CELL_TYPE;
    FocusedCellUtils.purge(etc.focusedElements.cell);
    setTimeout(() => {
      // CAUTION-2
      // when editing text then double clicking browser to resize, as soon as the browser begins to resize
      // it deletes column details and begins to regenerate them, however this still kicks in and attempts
      // to set the column type. The condition below fixes this by not running it when column details
      // do not exist or its type properties are not there. However if further bugs are noticed, rework
      // this by utilising a rendering indicator
      if (!etc.columnsDetails[columnIndex]?.cellTypeTotals) return;
      const newType = CellTypeTotalsUtils.parseType(textContainerElement.textContent as string, etc.defaultCellValue);
      CellTypeTotalsUtils.changeCellTypeAndSetNewColumnType(etc.columnsDetails[columnIndex], oldType, newType);
    });
  }

  private static blurCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    DataCellEvents.blur(this, rowIndex, columnIndex, event.target as HTMLElement);
  }

  // prettier-ignore
  // textContainerElement can be cell element for data cell, text element for category and date cells
  public static prepareText(etc: EditableTableComponent, rowIndex: number, columnIndex: number,
      textContainerElement: HTMLElement) {
    // THIS HAS TO BE CALLED IN A FOCUS EVENT!!!!!!!!!!!!!!!!!
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.setContentEditable(textContainerElement, rowIndex);
    // placed here and not in timeout because we need cells with a default value to be recorded before modification
    CellEvents.removeTextIfDefault(etc, rowIndex, columnIndex, textContainerElement);
  }

  private static focusCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const cellElement = event.target as HTMLElement;
    DataCellEvents.prepareText(this, rowIndex, columnIndex, cellElement);
    // REF-7
    if (this.userKeyEventsState[KEYBOARD_KEY.TAB]) CaretPosition.setToEndOfText(this, cellElement);
    FocusedCellUtils.set(this.focusedElements.cell, cellElement, rowIndex, columnIndex, this.defaultCellValue);
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    cellElement.onfocus = DataCellEvents.focusCell.bind(etc, rowIndex, columnIndex);
    cellElement.onblur = DataCellEvents.blurCell.bind(etc, rowIndex, columnIndex);
    // these are used in date cells and overwritten when converted from
    cellElement.onmouseenter = () => {};
    cellElement.onmouseleave = () => {};
    // this is used by category element and overwritten when converted from
    cellElement.onmousedown = () => {};
    cellElement.oninput = DataCellEvents.inputCell.bind(etc, rowIndex, columnIndex);
    cellElement.onpaste = DataCellEvents.pasteCell.bind(etc, rowIndex, columnIndex);
    cellElement.onkeydown = DataCellEvents.keyDownCell.bind(etc);
  }
}