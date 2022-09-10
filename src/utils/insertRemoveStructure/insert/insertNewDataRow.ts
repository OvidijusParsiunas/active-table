import {EditableTableComponent} from '../../../editable-table-component';
import {TableCellText, TableRow} from '../../../types/tableContents';
import {RowElement} from '../../../elements/row/rowElement';
import {InsertNewColumn} from './insertNewColumn';

// REF-1
export class InsertNewDataRow {
  // prettier-ignore
  private static addCells(etc: EditableTableComponent,
      newRowData: TableRow, newRowElement: HTMLElement, rowIndex: number) {
    newRowData.forEach((cellText: TableCellText, columnIndex: number) => {
      InsertNewColumn.insertToRow(etc, newRowElement, rowIndex, columnIndex, cellText as string);
    });
  }

  private static createNewRowData(etc: EditableTableComponent): TableRow {
    const numberOfColumns = etc.contents[0].length;
    return new Array(numberOfColumns).fill(etc.defaultCellValue);
  }

  private static insertNewRow(etc: EditableTableComponent, rowIndex: number, rowData?: TableRow) {
    const newRowData = rowData || InsertNewDataRow.createNewRowData(etc);
    const newRowElement = RowElement.create();
    InsertNewDataRow.addCells(etc, newRowData, newRowElement, rowIndex);
    etc.tableBodyElementRef?.insertBefore(newRowElement, etc.tableBodyElementRef.children[rowIndex]);
    // assuming that if rowData is provided, it is already in contents
    // WORK - potentially make this asynchronous
    if (rowData === undefined) etc.contents.splice(rowIndex, 0, newRowData);
  }

  public static insert(etc: EditableTableComponent, rowIndex: number, rowData?: TableRow) {
    InsertNewDataRow.insertNewRow(etc, rowIndex, rowData);
    setTimeout(() => etc.onTableUpdate(etc.contents));
  }

  public static insertEvent(this: EditableTableComponent, rowIndex: number) {
    InsertNewDataRow.insert(this, rowIndex);
  }
}
