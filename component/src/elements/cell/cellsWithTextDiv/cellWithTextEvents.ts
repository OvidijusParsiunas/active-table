import {SelectCellTextBaseEvents} from './selectCell/baseEvents/selectCellTextBaseEvents';
import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {CaretDisplayFix} from '../../../utils/browser/caretDisplayFix';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {DataCellEvents} from '../dataCell/dataCellEvents';
import {CellDetails} from '../../../types/focusedCell';
import {ActiveTable} from '../../../activeTable';
import {CellElement} from '../cellElement';

type FocusCallback = (at: ActiveTable, columnIndex: number, cellElement: HTMLElement) => void;
type BlurCallback = (at: ActiveTable) => void;

export class CellWithTextEvents {
  // prettier-ignore
  public static focusText(this: ActiveTable, rowIndex: number, columnIndex: number,
      focusCallback: FocusCallback | null, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    const cellElement = CellElement.getCellElement(textElement);
    DataCellEvents.prepareText(this, rowIndex, columnIndex, textElement);
    focusCallback?.(this, columnIndex, cellElement);
    FocusedCellUtils.set(this.focusedElements.cell, cellElement, rowIndex, columnIndex);
    if (this.userKeyEventsState[KEYBOARD_KEY.TAB]) {
      // contrary to this being called on mouseDownCell - this does not retrigger focus event
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  public static programmaticBlur(at: ActiveTable) {
    const {rowIndex, columnIndex, element} = at.focusedElements.cell as CellDetails;
    const textElement = CellElement.getTextElement(element);
    textElement.blur();
    // the above will not trigger the SelectCellEvents.blur functionality if dropdown has been focused, but will blur
    // the element in the dom, the following will trigger the required programmatic functionality
    if (at.focusedElements.cellDropdown) {
      SelectCellTextBaseEvents.blurring(at, rowIndex, columnIndex, textElement);
      delete at.focusedElements.cellDropdown;
    }
  }

  // prettier-ignore
  public static mouseDownCell(at: ActiveTable, blurCallback: BlurCallback | null,
      cellElement: HTMLElement, event: MouseEvent) {
    const textElement = CellElement.getTextElement(cellElement);
    // needed to set cursor at the end
    event.preventDefault();
    blurCallback?.(at);
    // Firefox and Safari do not fire the focus event for CaretPosition.setToEndOfText
    if (CaretDisplayFix.isIssueBrowser()) textElement.focus();
    // in non firefox browsers this focuses
    CaretPosition.setToEndOfText(at, textElement);
  }

  public static mouseDown(this: ActiveTable, blurCallback: BlurCallback | null, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // this is also triggered by text, but we only want on cell focus
    if (targetElement.classList.contains(CellElement.CELL_CLASS)) {
      const cellElement = event.target as HTMLElement;
      CellWithTextEvents.mouseDownCell(this, blurCallback, cellElement, event);
    }
  }
}
