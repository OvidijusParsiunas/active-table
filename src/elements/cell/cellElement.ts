import {InsertNewColumn} from '../../utils/insertRemoveStructure/insert/insertNewColumn';
import {EditableTableComponent} from '../../editable-table-component';
import {CellEvents} from './cellEvents';

export class CellElement {
  // prettier-ignore
  public static setCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, newRowIndex: number, columnIndex: number) {
    cellElement.oninput = CellEvents.inputCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onpaste = CellEvents.pasteCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onblur = CellEvents.blurCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onfocus = CellEvents.focusCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onmouseenter = CellEvents.mouseEnterCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onmouseleave = CellEvents.mouseLeaveCell.bind(etc, newRowIndex, columnIndex);
  }

  private static createCellDOMElement(etc: EditableTableComponent, cellText: string, isHeader: boolean) {
    const isContentEditable = isHeader ? !!etc.areHeadersEditable : true;
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.style.width = InsertNewColumn.DEFAULT_COLUMN_WIDTH;
    cellElement.contentEditable = String(isContentEditable);
    cellElement.textContent = cellText as string;
    return cellElement;
  }

  public static createCellElement(etc: EditableTableComponent, cellText: string, rowIndex: number, columnIndex: number) {
    const cellElement = CellElement.createCellDOMElement(etc, cellText, rowIndex === 0);
    CellElement.setCellEvents(etc, cellElement, rowIndex, columnIndex);
    return cellElement;
  }
}
