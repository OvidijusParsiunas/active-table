import {EditableTableComponent} from '../../../../editable-table-component';
import {DateCellInputElement} from './dateCellInputElement';
import {MOUSE_EVENT} from '../../../../consts/mouseEvents';
import {DateCellTextElement} from './dateCellTextElement';
import {CellEvents} from '../../cellEvents';

// the user does not use the actual input element and the events are triggered via the date picker (calendar)
export class DateCellInputEvents {
  // outstanding bug is when the user opens picker and moves with arrow keys, then clicks escape
  // the picker fires a clear event and does not actually close itself and instead goes to the
  // initially opened up date. The key up event for the escape button is also not fired.
  public static escapeKeyInput(etc: EditableTableComponent) {
    if (etc.activeOverlayElements.datePickerCell) {
      const focusedCell = etc.focusedElements.cell.element as HTMLElement;
      // do not hide when currently hovered
      if (etc.hoveredElements.dateCell !== focusedCell) {
        DateCellInputElement.toggle(focusedCell, false);
      }
      delete etc.activeOverlayElements.datePickerCell;
    }
  }

  // this is triggered when a date is selected via the date picker
  // prettier-ignore
  private static inputInput(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const {elements, settings: {defaultText}, activeType: {calendar}} = this.columnsDetails[columnIndex];
    if (!calendar) return;
    const inputDate = (event.target as HTMLInputElement).value;
    const convertedDateFromInput = DateCellTextElement.convertInputValueToText(inputDate, defaultText, calendar);
    const cellElement = elements[rowIndex];
    CellEvents.updateCell(this, convertedDateFromInput, rowIndex, columnIndex, {element: cellElement});
  }

  // this is triggered when the user clicks on picker buttons
  private static changeInput(this: EditableTableComponent) {
    const focusedCell = this.focusedElements.cell.element as HTMLElement;
    if (
      // this.userKeyEventsState[MOUSE_EVENT.DOWN] is used to prevent a bug where if the user opens the date picker,
      // uses arrow keys to navigate and clicks mouse down back on the cell - this event is fired
      !this.userKeyEventsState[MOUSE_EVENT.DOWN] &&
      // do not hide icon when currently hovered
      this.hoveredElements.dateCell !== focusedCell
    ) {
      DateCellInputElement.toggle(focusedCell, false);
    }
    delete this.activeOverlayElements.datePickerCell;
  }

  // the user does not use the actual input element and the events are triggered via the date picker
  public static setEvents(etc: EditableTableComponent, inputContainer: HTMLElement, rowIndex: number, colIndex: number) {
    inputContainer.onchange = DateCellInputEvents.changeInput.bind(etc);
    inputContainer.oninput = DateCellInputEvents.inputInput.bind(etc, rowIndex, colIndex);
  }
}
