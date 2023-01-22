import {EditableHeaderIconTextEvents} from '../../cellsWithTextDiv/headerIconCell/editable/editableHeaderIconTextEvents';
import {FocusedCellUtils} from '../../../../utils/focusedElements/focusedCellUtils';
import {CellWithTextEvents} from '../../cellsWithTextDiv/cellWithTextEvents';
import {HeaderCellEvents} from '../headerCellEvents';
import {ActiveTable} from '../../../../activeTable';
import {CellElement} from '../../cellElement';

export class EditableHeaderCellEvents {
  private static mouseClickCell(this: ActiveTable, columnIndex: number, event: MouseEvent) {
    const cellElement = event.target as HTMLElement;
    FocusedCellUtils.purge(this.focusedElements.cell);
    setTimeout(() => FocusedCellUtils.setHeaderCell(this.focusedElements.cell, cellElement, columnIndex));
  }

  public static setEvents(at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    // important to note that this is still using data cell input event
    cellElement.onmouseenter = HeaderCellEvents.mouseEnterCell.bind(at, columnIndex);
    cellElement.onmouseleave = HeaderCellEvents.mouseLeaveCell.bind(at, columnIndex);
    if (at.displayIconsInHeaders) {
      cellElement.onfocus = () => {};
      cellElement.onblur = () => {};
      cellElement.onmousedown = CellWithTextEvents.mouseDown.bind(at, null);
      cellElement.onclick = EditableHeaderCellEvents.mouseClickCell.bind(at, columnIndex);
      const textElement = CellElement.getTextElement(cellElement);
      EditableHeaderIconTextEvents.setEvents(at, textElement, rowIndex, columnIndex);
    } else {
      cellElement.onclick = HeaderCellEvents.mouseClick.bind(at, columnIndex);
    }
  }
}
