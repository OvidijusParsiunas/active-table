import {EditableTableComponent} from '../../editable-table-component';
import {TableRow} from '../../types/tableContents';
import {CellEvents} from './cellEvents';

export class CellElement {
  private static createCellElement(etc: EditableTableComponent, cellText: string, isHeader: boolean) {
    const isContentEditable = isHeader ? !!etc.areHeadersEditable : true;
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.contentEditable = String(isContentEditable);
    cellElement.textContent = cellText as string;
    return cellElement;
  }
  // prettier-ignore
  private static setCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, newRowIndex: number, columnIndex: number) {
    cellElement.oninput = CellEvents.inputCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onpaste = CellEvents.pasteCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onblur = CellEvents.blurCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onfocus = CellEvents.focusCell.bind(etc, newRowIndex, columnIndex);
  }

  // prettier-ignore
  private static createCell(etc: EditableTableComponent,
      cellText: string, rowIndex: number, columnIndex: number, isHeader: boolean) {
    const cellElement = CellElement.createCellElement(etc, cellText, isHeader);
    const newRowIndex = isHeader ? 0 : rowIndex + 1;
    CellElement.setCellEvents(etc, cellElement, newRowIndex, columnIndex);
    return cellElement;
  }

  // prettier-ignore
  public static createRowCellElements(etc: EditableTableComponent,
      dataRow: TableRow, rowIndex: number, isHeader: boolean) {
    return dataRow.map((cellText: string | number, columnIndex: number) => {
      return CellElement.createCell(etc, cellText as string, rowIndex, columnIndex, isHeader);
    });
  }
}
