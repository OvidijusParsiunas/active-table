import {EditableTableComponent} from '../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';
import {CellElement} from '../../elements/cell/cellElement';
import {RowElement} from '../../elements/row/rowElement';
import {TableRow} from '../../types/tableContents';

export class InsertNewDataRow {
  private static updateLowerRows(etc: EditableTableComponent, dataRowIndex: number) {
    const lowerRows = Array.from(etc.dataElementRef?.children || []).slice(dataRowIndex);
    lowerRows.forEach((rowElement: Node, rowIndex: number) => {
      const relativeRowIndex = rowIndex + dataRowIndex + 1;
      Array.from((rowElement as HTMLElement).children).forEach((cellElement: Node, columnIndex: number) => {
        etc.onCellUpdate(cellElement.textContent as string, relativeRowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
        CellElement.setCellEvents(etc, cellElement as HTMLElement, relativeRowIndex, columnIndex);
      });
    });
  }

  private static insertNewRow(etc: EditableTableComponent, contentsRowIndex: number) {
    const newRowData = InsertNewDataRow.createNewRowData(etc);
    const newRowElement = RowElement.create(etc, newRowData, contentsRowIndex);
    etc.dataElementRef?.insertBefore(newRowElement, etc.dataElementRef.children[contentsRowIndex - 1]);
    etc.contents.splice(contentsRowIndex, 0, newRowData);
    Array.from(newRowElement.children).forEach((cellElement: Node, columnIndex: number) => {
      etc.onCellUpdate(cellElement.textContent as string, contentsRowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
    });
  }

  private static createNewRowData(etc: EditableTableComponent): TableRow {
    const numberOfColumns = etc.contents[0].length;
    return new Array(numberOfColumns).fill(etc.defaultValue);
  }

  public static insert(this: EditableTableComponent, dataRowIndex: number) {
    const contentsRowIndex = dataRowIndex + 1;
    InsertNewDataRow.insertNewRow(this, contentsRowIndex);
    setTimeout(() => {
      InsertNewDataRow.updateLowerRows(this, contentsRowIndex);
      this.onTableUpdate(this.contents);
    });
  }
}
