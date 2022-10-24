import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../../consts/keyboardKeys';
import {DateCellInputElement} from './dateCellInputElement';
import {MOUSE_EVENT} from '../../../../consts/mouseEvents';
import {DateCellTextElement} from './dateCellTextElement';
import {CellElement} from '../../cellElement';
import {CellEvents} from '../../cellEvents';

export class DateCellInputEvents {
  // outstanding bug is when the user opens picker and moves with arrow keys, then clicks escape
  // the picker fires a clear event and does not actually close itself and instead goes to the
  // initially opened up date. The key up event for the escape button is also not fired.
  private static keyUpInput(this: EditableTableComponent, event: KeyboardEvent) {
    const inputElement = event.target as HTMLElement;
    if (event.key === KEYBOARD_KEY.ESCAPE && this.overlayElementsState.datePickerInput) {
      if (
        // do not hide when currently hovered
        this.hoveredElements.dateCell !== CellElement.extractCellElement(inputElement)
      ) {
        DateCellInputElement.toggle(inputElement, false);
      }
      delete this.overlayElementsState.datePickerInput;
    }
  }

  // this is triggered when a date is selected via the date picker
  // prettier-ignore
  private static inputInput(this: EditableTableComponent, rowIndex: number, columnIndex: number, dateType: string,
      event: Event) {
    const inputDate = (event.target as HTMLInputElement).value;
    const convertedDateFromInput = DateCellTextElement.convertInputValueToText(inputDate, this.defaultCellValue, dateType);
    const cellElement = this.columnsDetails[columnIndex].elements[rowIndex];
    CellEvents.updateCell(this, convertedDateFromInput, rowIndex, columnIndex, {element: cellElement});
  }

  // this is triggered when the user clicks on picker buttons
  private static changeInput(this: EditableTableComponent, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (
      // this.userKeyEventsState[MOUSE_EVENT.DOWN] is used to prevent a bug where if the user opens the date picker,
      // uses arrow keys to navigate and clicks mouse down back on the cell - this event is fired
      !this.userKeyEventsState[MOUSE_EVENT.DOWN] &&
      // do not hide icon when currently hovered
      this.hoveredElements.dateCell !== CellElement.extractCellElement(inputElement)
    ) {
      DateCellInputElement.toggle(inputElement, false);
    }
    delete this.overlayElementsState.datePickerInput;
  }

  private static mouseDownInput(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const inputElement = event.target as HTMLInputElement;
    const cellElement = CellElement.extractCellElement(inputElement);
    FocusedCellUtils.set(this.focusedElements.cell, cellElement, rowIndex, columnIndex, this.defaultCellValue);
    // the reason why this is in a timeout is because this method is triggered before window mouse down event is triggered
    // hence delete his.overlayElementsState.datePickerInput is called after it and the setter needs to be called after
    setTimeout(() => (this.overlayElementsState.datePickerInput = inputElement));
  }

  // prettier-ignore
  public static setEvents(etc: EditableTableComponent, inputElement: HTMLInputElement, rowIndex: number,
      columnIndex: number, dateType: string) {
    inputElement.onmousedown = DateCellInputEvents.mouseDownInput.bind(etc, rowIndex, columnIndex);
    inputElement.onchange = DateCellInputEvents.changeInput.bind(etc);
    inputElement.oninput = DateCellInputEvents.inputInput.bind(etc, rowIndex, columnIndex, dateType);
    inputElement.onkeyup = DateCellInputEvents.keyUpInput.bind(etc);
  }
}
