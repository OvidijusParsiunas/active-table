import {EditableTableComponent} from '../../../../../editable-table-component';
import {EditableHeaderIconTextEvents} from './editableHeaderIconTextEvents';
import {HeaderCellEvents} from '../../../headerCell/headerCellEvents';
import {CellWithTextEvents} from '../../cellWithTextEvents';
import {CellElement} from '../../../cellElement';

export class EditableHeaderIconCellEvents {
  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using them on text element to keep it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    cellElement.onmouseenter = HeaderCellEvents.mouseEnterCell.bind(etc, columnIndex);
    cellElement.onmouseleave = HeaderCellEvents.mouseLeaveCell.bind(etc, columnIndex);
    cellElement.onmousedown = CellWithTextEvents.mouseDownCell.bind(etc, null);
    const textElement = CellElement.getTextElement(cellElement);
    EditableHeaderIconTextEvents.setEvents(etc, textElement, rowIndex, columnIndex);
  }
}
