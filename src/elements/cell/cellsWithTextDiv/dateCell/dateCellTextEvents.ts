import {FocusNextCellFromCategoryCell} from '../../../../utils/focusedElements/focusNextCellFromCategoryCell';
import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {CaretPosition} from '../../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../../editable-table-component';
import {FocusedElements} from '../../../../types/focusedElements';
import {KEYBOARD_KEY} from '../../../../consts/keyboardKeys';
import {DateCellInputElement} from './dateCellInputElement';
import {DataCellEvents} from '../../dataCellEvents';

export class DateCellTextEvents {
  private static blur(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    DataCellEvents.blur(this, rowIndex, columnIndex, textElement);
  }

  // prettier-ignore
  private static focusText(this: EditableTableComponent, rowIndex: number, columnIndex: number,
      focusedElements: FocusedElements, defaultCellValue: string, event: Event) {
    const textElement = event.target as HTMLElement;
    const cellElement = (event.target as HTMLElement).parentElement as HTMLElement;
    DataCellEvents.prepareText(this, rowIndex, columnIndex, textElement);
    FocusedCellUtils.set(focusedElements.cell, cellElement, rowIndex, columnIndex, defaultCellValue);
    if (this.userKeyEventsState[KEYBOARD_KEY.TAB]) {
      // contrary to this being called on mouseDownCell - this does not retrigger focus event
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  private static keyDownOnText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.TAB) {
      event.preventDefault();
      DataCellEvents.keyDownCell.bind(this)(event);
      FocusNextCellFromCategoryCell.focusOrBlurRowNextCell(this, columnIndex, rowIndex);
    }
  }

  public static updateInputBasedOnTextDiv(defaultCellValue: string, dateType: string, cellElement: HTMLElement) {
    const textElement = cellElement.children[0] as HTMLElement;
    const inputElementContainer = cellElement.children[1] as HTMLElement;
    const inputElement = inputElementContainer.children[0] as HTMLInputElement;
    const date = DateCellInputElement.convertToInput(textElement.textContent as string, defaultCellValue, dateType);
    inputElement.value = date;
  }

  private static textDivInput(defaultCellValue: string, dateType: string, event: Event) {
    const textElement = event.target as HTMLElement;
    const cellElement = textElement.parentElement as HTMLElement;
    DateCellTextEvents.updateInputBasedOnTextDiv(defaultCellValue, dateType, cellElement);
  }

  // prettier-ignore
  public static setEvents(etc: EditableTableComponent, textElement: HTMLElement, rowIndex: number, columnIndex: number,
      dateType: string) {
    textElement.onfocus = DateCellTextEvents.focusText.bind(etc, rowIndex, columnIndex,
      etc.focusedElements, etc.defaultCellValue);
    textElement.onblur = DateCellTextEvents.blur.bind(etc, rowIndex, columnIndex);
    textElement.oninput = DateCellTextEvents.textDivInput.bind(this, etc.defaultCellValue, dateType);
    textElement.onkeydown = DateCellTextEvents.keyDownOnText.bind(etc, rowIndex, columnIndex);
  }
}
