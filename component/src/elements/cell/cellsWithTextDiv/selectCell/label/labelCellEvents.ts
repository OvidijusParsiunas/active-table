import {EditableTableComponent} from '../../../../../editable-table-component';
import {SelectCellTextBaseEvents} from '../baseEvents/selectCellTextBaseEvents';
import {SelectCellBaseEvents} from '../baseEvents/selectCellBaseEvents';
import {CellWithTextEvents} from '../../cellWithTextEvents';

export class LabelCellEvents {
  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!etc.columnsDetails[columnIndex].settings.isCellTextEditable) return;
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    cellElement.onmouseenter = () => {};
    cellElement.onmouseleave = () => {};
    cellElement.onmousedown = CellWithTextEvents.mouseDown.bind(etc, SelectCellBaseEvents.blurIfDropdownFocused);
    const textElement = cellElement.children[0] as HTMLElement;
    SelectCellTextBaseEvents.setEvents(etc, textElement, rowIndex, columnIndex);
  }
}
