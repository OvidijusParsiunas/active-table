import {DateCellCalendarIconEvents} from './dateCellCalendarIconEvents';
import {DateCellInputElement} from './dateCellInputElement';
import {Browser} from '../../../../utils/browser/browser';
import {DateCellInputEvents} from './dateCellInputEvents';
import {CellWithTextEvents} from '../cellWithTextEvents';
import {DateCellTextEvents} from './dateCellTextEvents';
import {ActiveTable} from '../../../../activeTable';

export class DateCellEvents {
  private static mouseLeaveCell(this: ActiveTable, event: MouseEvent) {
    // this needs to be here as otherwise it would not be called due to the return statement below
    delete this.hoveredElements.dateCell;
    if (Browser.IS_INPUT_DATE_SUPPORTED) {
      const cellElement = event.target as HTMLElement;
      // if the date picker is opened, do not hide container
      if (this.activeOverlayElements.datePickerCell === cellElement) return;
      DateCellInputElement.toggle(cellElement, false);
    }
  }

  private static mouseEnterCell(this: ActiveTable, event: MouseEvent) {
    this.hoveredElements.dateCell = event.target as HTMLElement;
    if (Browser.IS_INPUT_DATE_SUPPORTED) {
      DateCellInputElement.toggle(this.hoveredElements.dateCell, true);
    }
  }

  public static setEvents(at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!at.columnsDetails[columnIndex].settings.isCellTextEditable) return;
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using them on text element to keep it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    cellElement.onmouseenter = DateCellEvents.mouseEnterCell.bind(at);
    cellElement.onmouseleave = DateCellEvents.mouseLeaveCell.bind(at);
    cellElement.onmousedown = CellWithTextEvents.mouseDown.bind(at, null);
    const textElement = cellElement.children[0] as HTMLElement;
    DateCellTextEvents.setEvents(at, textElement, rowIndex, columnIndex);
    if (Browser.IS_INPUT_DATE_SUPPORTED) {
      const inputContainer = cellElement.children[1] as HTMLElement;
      DateCellInputEvents.setEvents(at, inputContainer, rowIndex, columnIndex);
      const calendarElement = inputContainer.children[1] as HTMLElement;
      DateCellCalendarIconEvents.setEvents(at, calendarElement, rowIndex, columnIndex);
    }
  }
}
