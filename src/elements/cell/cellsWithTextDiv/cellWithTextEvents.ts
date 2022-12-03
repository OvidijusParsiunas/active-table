import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {CaretPosition} from '../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../editable-table-component';
import {CategoryCellEvents} from './categoryCell/categoryCellEvents';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {DataCellEvents} from '../dataCell/dataCellEvents';
import {Browser} from '../../../utils/browser/browser';
import {CellDetails} from '../../../types/focusedCell';
import {CellElement} from '../cellElement';

type FocusCallback = (etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) => void;
type BlurCallback = (etc: EditableTableComponent) => void;

export class CellWithTextEvents {
  // prettier-ignore
  public static focusText(this: EditableTableComponent, rowIndex: number, columnIndex: number,
      focusCallback: FocusCallback | null, event: FocusEvent) {
    const {focusedElements: {cell}, columnsDetails} = this;
    const textElement = event.target as HTMLElement;
    const cellElement = CellElement.extractCellElement(textElement);
    DataCellEvents.prepareText(this, rowIndex, columnIndex, textElement);
    focusCallback?.(this, columnIndex, cellElement);
    FocusedCellUtils.set(cell, cellElement, rowIndex, columnIndex, columnsDetails[columnIndex].types);
    if (this.userKeyEventsState[KEYBOARD_KEY.TAB]) {
      // contrary to this being called on mouseDownCell - this does not retrigger focus event
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  public static programmaticBlur(etc: EditableTableComponent) {
    const {rowIndex, columnIndex, element} = etc.focusedElements.cell as CellDetails;
    const textElement = element.children[0] as HTMLElement;
    textElement.blur();
    // the above will not trigger the CategoryCellEvents.blur functionality if dropdown has been focused, but will blur
    // the element in the dom, the following will trigger the required programmatic functionality
    if (etc.focusedElements.categoryDropdown) {
      CategoryCellEvents.blurring(etc, rowIndex, columnIndex, textElement);
      delete etc.focusedElements.categoryDropdown;
    }
  }

  public static mouseDownCell(this: EditableTableComponent, blurCallback: BlurCallback | null, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // this is also triggered by text, but we only want when cell to focus
    if (targetElement.classList.contains(CellElement.CELL_CLASS)) {
      const cellElement = event.target as HTMLElement;
      const textElement = cellElement.children[0] as HTMLElement;
      // needed to set cursor at the end
      event.preventDefault();
      blurCallback?.(this);
      // Firefox does not fire the focus event for CaretPosition.setToEndOfText
      if (Browser.IS_FIREFOX) textElement.focus();
      // in non firefox browsers this also focuses
      CaretPosition.setToEndOfText(this, textElement);
    }
  }
}
