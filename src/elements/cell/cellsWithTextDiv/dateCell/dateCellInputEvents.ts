import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../../consts/keyboardKeys';
import {DateCellInputElement} from './dateCellInputElement';
import {MOUSE_EVENT} from '../../../../consts/mouseEvents';
import {DateCellElement} from './dateCellElement';
import {CellElement} from '../../cellElement';
import {CellEvents} from '../../cellEvents';

export class DateCellInputEvents {
  private static convertFromInput(chosenDate: string, defaultCellValue: string, dateType: string) {
    const integers = chosenDate?.match(/\d+/g) as RegExpMatchArray;
    if (integers?.length === 3) {
      const properties = DateCellElement.DATE_TYPE_TO_PROPERTIES[dateType];
      const date = new Array<string>();
      date[properties.structureIndexes.day] = integers[2];
      date[properties.structureIndexes.month] = integers[1];
      date[properties.structureIndexes.year] = integers[0];
      return date.join(properties.separator);
    }
    return defaultCellValue;
  }

  // this is triggered when the user clicks on picker buttons
  private static change(this: EditableTableComponent, event: Event) {
    if (
      // this.userKeyEventsState[MOUSE_EVENT.DOWN] is used to prevent a bug where if the user opens the date picker,
      // uses arrow keys to navigate and clicks back on the cell - this event is fired
      !this.userKeyEventsState[MOUSE_EVENT.DOWN] &&
      // do not hide when currently hovered
      this.hoveredElements.dateCell !== CellElement.extractCellElement(event.target as HTMLElement)
    ) {
      DateCellInputElement.hideDatePicker(event.target as HTMLInputElement);
    }
    delete this.overlayElementsState.datePickerInput;
  }

  // outstanding bug is when the user opens picker and moves with arrow keys, then clicks enter
  // the picker fires a clear event and does not actuall close itself and instead goes to the
  // initially opened up date. The key up event for the escape button is also not fired.
  private static keyUp(this: EditableTableComponent, event: KeyboardEvent) {
    if (
      event.key === KEYBOARD_KEY.ESCAPE &&
      this.overlayElementsState.datePickerInput &&
      // do not hide when currently hovered
      this.hoveredElements.dateCell !== CellElement.extractCellElement(event.target as HTMLElement)
    ) {
      DateCellInputElement.hideDatePicker(this.overlayElementsState.datePickerInput);
      delete this.overlayElementsState.datePickerInput;
    }
  }

  // prettier-ignore
  private static input(this: EditableTableComponent, rowIndex: number, columnIndex: number, dateType: string,
    event: Event) {
  const chosenDate = (event.target as HTMLInputElement).value;
  const appropariateFormatDate = DateCellInputEvents.convertFromInput(chosenDate, this.defaultCellValue, dateType);
  const element = this.columnsDetails[columnIndex].elements[rowIndex];
  CellEvents.updateCell(this, appropariateFormatDate, rowIndex, columnIndex, {element});
}

  private static markDatePicker(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    const inputElement = event.target as HTMLInputElement;
    const cellElement = CellElement.extractCellElement(inputElement);
    FocusedCellUtils.set(this.focusedElements.cell, cellElement, rowIndex, columnIndex, this.defaultCellValue);
    setTimeout(() => (this.overlayElementsState.datePickerInput = inputElement));
  }

  // prettier-ignore
  public static setEvents(etc: EditableTableComponent, inputElement: HTMLInputElement, rowIndex: number,
      columnIndex: number, dateType: string) {
    inputElement.onmousedown = DateCellInputEvents.markDatePicker.bind(etc, rowIndex, columnIndex);
    inputElement.onchange = DateCellInputEvents.change.bind(etc);
    inputElement.oninput = DateCellInputEvents.input.bind(etc, rowIndex, columnIndex, dateType);
    inputElement.onkeyup = DateCellInputEvents.keyUp.bind(etc);
  }
}
