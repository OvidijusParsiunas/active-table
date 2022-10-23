import {CaretPosition} from '../../../../utils/focusedElements/caretPosition';
import {EditableTableComponent} from '../../../../editable-table-component';
import {Browser} from '../../../../utils/browser/browser';
import {DateCellInputEvents} from './dateCellInputEvents';
import {DateCellTextEvents} from './dateCellTextEvents';
import {CellElement} from '../../cellElement';

export class DateCellEvents {
  private static mouseEnter(this: EditableTableComponent, event: MouseEvent) {
    const cell = event.target as HTMLElement;
    this.hoveredElements.dateCell = cell;
    (cell.children[1] as HTMLElement).style.display = 'block';
  }

  private static mouseLeave(this: EditableTableComponent, event: MouseEvent) {
    const cell = event.target as HTMLElement;
    delete this.hoveredElements.dateCell;
    if (this.overlayElementsState.datePickerInput === cell?.children[1]?.children[0]) return;
    (cell.children[1] as HTMLElement).style.display = 'none';
  }

  private static mouseDownCell(this: EditableTableComponent, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // this is also triggered by text, but we only want when cell to focus
    if (targetElement.classList.contains(CellElement.CELL_CLASS)) {
      const cellElement = event.target as HTMLElement;
      const textElement = cellElement.children[0] as HTMLElement;
      // needed to set cursor at the end
      event.preventDefault();
      // Firefox does not fire the focus event for CaretPosition.setToEndOfText
      if (Browser.IS_FIREFOX) textElement.focus();
      // in non firefox browsers this also focuses
      CaretPosition.setToEndOfText(this, textElement);
    }
  }

  // prettier-ignore
  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number,
      dateType: string) {
    // onblur/onfocus do not work for firefox, hence using them on text element to keep it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    cellElement.onmouseenter = DateCellEvents.mouseEnter.bind(etc);
    cellElement.onmouseleave = DateCellEvents.mouseLeave.bind(etc);
    cellElement.onmousedown = DateCellEvents.mouseDownCell.bind(etc);
    const textElement = cellElement.children[0] as HTMLElement;
    DateCellTextEvents.setEvents(etc, textElement, rowIndex, columnIndex, dateType);
    const inputElement = cellElement.children[1] as HTMLInputElement;
    DateCellInputEvents.setEvents(etc, inputElement, rowIndex, columnIndex, dateType);
  }
}
