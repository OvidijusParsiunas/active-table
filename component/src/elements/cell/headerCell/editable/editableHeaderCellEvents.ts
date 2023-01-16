import {EditableHeaderIconTextEvents} from '../../cellsWithTextDiv/headerIconCell/editable/editableHeaderIconTextEvents';
import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {CellWithTextEvents} from '../../cellsWithTextDiv/cellWithTextEvents';
import {EditableTableComponent} from '../../../../editable-table-component';
import {HeaderCellEvents} from '../headerCellEvents';
import {CellElement} from '../../cellElement';

export class EditableHeaderCellEvents {
  private static mouseClickCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    FocusedCellUtils.purge(this.focusedElements.cell);
    setTimeout(() => FocusedCellUtils.setHeaderCell(this.focusedElements.cell, cellElement, columnIndex));
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    // important to note that this is still using data cell input event
    cellElement.onmouseenter = HeaderCellEvents.mouseEnterCell.bind(etc, columnIndex);
    cellElement.onmouseleave = HeaderCellEvents.mouseLeaveCell.bind(etc, columnIndex);
    if (etc.areIconsDisplayedInHeaders) {
      cellElement.onfocus = () => {};
      cellElement.onblur = () => {};
      cellElement.onmousedown = CellWithTextEvents.mouseDown.bind(etc, null);
      cellElement.onclick = EditableHeaderCellEvents.mouseClickCell.bind(etc, columnIndex);
      const textElement = CellElement.getTextElement(cellElement);
      EditableHeaderIconTextEvents.setEvents(etc, textElement, rowIndex, columnIndex);
    } else {
      cellElement.onclick = HeaderCellEvents.mouseClick.bind(etc, columnIndex);
    }
  }
}
