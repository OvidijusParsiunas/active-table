import {OverwriteCellsViaCSVOnPaste} from '../../../utils/paste/CSV/overwriteCellsViaCSVOnPaste';
import {FirefoxCaretDisplayFix} from '../../../utils/browser/firefox/firefoxCaretDisplayFix';
import {UserKeyEventsStateUtils} from '../../../utils/userEventsState/userEventsStateUtils';
import {DateCellInputElement} from '../cellsWithTextDiv/dateCell/dateCellInputElement';
import {ColumnSettingsUtils} from '../../../utils/columnSettings/columnSettingsUtils';
import {CategoryDropdown} from '../../dropdown/categoryDropdown/categoryDropdown';
import {CellTypeTotalsUtils} from '../../../utils/columnType/cellTypeTotalsUtils';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../editable-table-component';
import {KEYBOARD_EVENT} from '../../../consts/keyboardEvents';
import {PasteUtils} from '../../../utils/paste/pasteUtils';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {UNDO_INPUT_TYPE} from '../../../consts/domEvents';
import {Browser} from '../../../utils/browser/browser';
import {CellElement} from '../cellElement';
import {CellEvents} from '../cellEvents';

export class DataCellEvents {
  public static keyDownCell(this: EditableTableComponent, event: KeyboardEvent) {
    // REF-7
    if (event.key === KEYBOARD_KEY.TAB) {
      UserKeyEventsStateUtils.temporarilyIndicateEvent(this.userKeyEventsState, KEYBOARD_KEY.TAB);
    }
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
    const text = CellElement.getText(textContainerElement);
    // sanitizePastedTextContent causes inputType to no longer be insertFromPaste, hence using this instead
    if (!this.userKeyEventsState[KEYBOARD_EVENT.PASTE]) {
      const isUndo = inputEvent.inputType === UNDO_INPUT_TYPE;
      CellElement.processCellWithNewText(this, textContainerElement, text, false, isUndo, false);
      const columnDetails = this.columnsDetails[columnIndex];
      if (columnDetails.activeType.categories) {
        CategoryDropdown.updateCategoryDropdown(textContainerElement.parentElement as HTMLElement,
          columnDetails.categoryDropdown, columnDetails.settings.defaultText, true);
      }
      CellEvents.updateCell(this, text, rowIndex, columnIndex, {processText: false});
    }
  }

  // prettier-ignore
  private static pasteCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: ClipboardEvent) {
    UserKeyEventsStateUtils.temporarilyIndicateEvent(this.userKeyEventsState, KEYBOARD_EVENT.PASTE);
    PasteUtils.sanitizePastedTextContent(event);
    const clipboardText = PasteUtils.extractClipboardText(event);
    if (OverwriteCellsViaCSVOnPaste.isCSVData(clipboardText)) {
      OverwriteCellsViaCSVOnPaste.overwrite(this, clipboardText, event, rowIndex, columnIndex);
    } else {
      const targetElement = event.target as HTMLElement;
      const {categoryDropdown, settings: {defaultText}, activeType} = this.columnsDetails[columnIndex];
      const {calendar, categories} = activeType;
      // if the user has deleted all text in calendar/category cell - targetElement can be the <br> tag
      const containerElement = calendar || categories ? (targetElement.parentElement as HTMLElement) : targetElement;
      setTimeout(() => {
        if (categories) CategoryDropdown.updateCategoryDropdown(containerElement, categoryDropdown, defaultText, true);
        CellEvents.updateCell(this, CellElement.getText(containerElement), rowIndex, columnIndex, {processText: false});
      });
    }
  }

  // prettier-ignore
  // textContainerElement can be cell element for data cell, text element for category and date cells
  public static blur(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, textContainerElement: HTMLElement) {
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.removeContentEditable(textContainerElement);
    CellEvents.setCellToDefaultIfNeeded(etc, rowIndex, columnIndex, textContainerElement);
    const oldType = etc.focusedElements.cell.typeName;
    FocusedCellUtils.purge(etc.focusedElements.cell);
    setTimeout(() => {
      const columnDetails = etc.columnsDetails[columnIndex];
      const newType = CellTypeTotalsUtils.parseTypeName(CellElement.getText(textContainerElement), columnDetails.types);
      CellTypeTotalsUtils.changeCellType(columnDetails, oldType, newType); // CAUTION-2
    });
  }

  private static blurCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    if (rowIndex === 0 && !this.isColumnDropdownDisplayed) {
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(this, event.target as HTMLElement, columnIndex);
    }
    DataCellEvents.blur(this, rowIndex, columnIndex, event.target as HTMLElement);
  }

  // prettier-ignore
  // textContainerElement can be cell element for data cell, text element for category and date cells
  public static prepareText(etc: EditableTableComponent, rowIndex: number, columnIndex: number,
      textContainerElement: HTMLElement) {
    if (Browser.IS_FIREFOX) {
      // THIS HAS TO BE CALLED IN A FOCUS EVENT!!!!!!!!!!!!!!!!!
     if (rowIndex > 0 || !etc.isColumnDropdownDisplayed) FirefoxCaretDisplayFix.setContentEditable(textContainerElement);
    }
    // placed here and not in timeout because we need cells with a default value to be recorded before modification
    CellEvents.removeTextIfDefault(etc, rowIndex, columnIndex, textContainerElement);
  }

  private static focusCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const cellElement = event.target as HTMLElement;
    DataCellEvents.prepareText(this, rowIndex, columnIndex, cellElement);
    const {userKeyEventsState, focusedElements, columnsDetails} = this;
    // REF-7
    if (userKeyEventsState[KEYBOARD_KEY.TAB]) CaretPosition.setToEndOfText(this, cellElement);
    FocusedCellUtils.set(focusedElements.cell, cellElement, rowIndex, columnIndex, columnsDetails[columnIndex].types);
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!etc.columnsDetails[columnIndex].settings.isCellTextEditable) return;
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
