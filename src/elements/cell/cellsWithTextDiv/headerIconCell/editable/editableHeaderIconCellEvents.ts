import {EditableTableComponent} from '../../../../../editable-table-component';
import {EditableHeaderIconTextEvents} from './editableHeaderIconTextEvents';
import {CellWithTextEvents} from '../../cellWithTextEvents';
import {CellElement} from '../../../cellElement';

export class EditableHeaderIconCellEvents {
  private static mouseLeaveCell(this: EditableTableComponent) {
    delete this.hoveredElements.dateCell;
  }

  private static mouseEnterCell(this: EditableTableComponent, event: MouseEvent) {
    this.hoveredElements.dateCell = event.target as HTMLElement;
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!etc.areHeadersEditable) return;
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using them on text element to keep it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    cellElement.onmouseenter = EditableHeaderIconCellEvents.mouseEnterCell.bind(etc);
    cellElement.onmouseleave = EditableHeaderIconCellEvents.mouseLeaveCell.bind(etc);
    cellElement.onmousedown = CellWithTextEvents.mouseDownCell.bind(etc, null);
    const textElement = CellElement.getTextElement(cellElement);
    EditableHeaderIconTextEvents.setEvents(etc, textElement, rowIndex, columnIndex);
  }
}
