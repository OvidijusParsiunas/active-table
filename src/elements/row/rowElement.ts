import {EditableTableComponent} from '../../editable-table-component';
import {TableRow} from '../../types/tableContents';
import {CellElement} from '../cell/cellElement';

export class RowElement {
  public static create(etc: EditableTableComponent, dataRow: TableRow, rowIndex: number, isHeader = false) {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    const cellElements = CellElement.createRowCellElements(etc, dataRow, rowIndex, isHeader);
    cellElements.forEach((node) => rowElement.appendChild(node));
    return rowElement;
  }
}
