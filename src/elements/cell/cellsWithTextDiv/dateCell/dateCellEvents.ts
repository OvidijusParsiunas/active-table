import {EditableTableComponent} from '../../../../editable-table-component';
import {DateCellInputElement} from './dateCellInputElement';
import {Browser} from '../../../../utils/browser/browser';
import {DateCellInputEvents} from './dateCellInputEvents';
import {CellWithTextEvents} from '../cellWithTextEvents';
import {DateCellTextEvents} from './dateCellTextEvents';

export class DateCellEvents {
  private static mouseLeaveCell(this: EditableTableComponent, event: MouseEvent) {
    delete this.hoveredElements.dateCell;
    if (Browser.IS_INPUT_DATE_SUPPORTED) {
      const cell = event.target as HTMLElement;
      const input = DateCellInputElement.extractInputFromCell(cell);
      // if the date picker is opened, do not hide container
      if (this.overlayElementsState.datePickerInput === input) return;
      DateCellInputElement.toggle(input, false);
    }
  }

  private static mouseEnterCell(this: EditableTableComponent, event: MouseEvent) {
    const cell = event.target as HTMLElement;
    this.hoveredElements.dateCell = cell;
    if (Browser.IS_INPUT_DATE_SUPPORTED) {
      DateCellInputElement.toggle(DateCellInputElement.extractInputFromCell(cell), true);
    }
  }

  // prettier-ignore
  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number,
      dateType: string) {
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using them on text element to keep it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    cellElement.onmouseenter = DateCellEvents.mouseEnterCell.bind(etc);
    cellElement.onmouseleave = DateCellEvents.mouseLeaveCell.bind(etc);
    cellElement.onmousedown = CellWithTextEvents.mouseDownCell.bind(etc, null);
    const textElement = cellElement.children[0] as HTMLElement;
    DateCellTextEvents.setEvents(etc, textElement, rowIndex, columnIndex, dateType);
    if (Browser.IS_INPUT_DATE_SUPPORTED) {
      const inputElement = cellElement.children[1] as HTMLInputElement;
      DateCellInputEvents.setEvents(etc, inputElement, rowIndex, columnIndex, dateType);
    }
  }
}
