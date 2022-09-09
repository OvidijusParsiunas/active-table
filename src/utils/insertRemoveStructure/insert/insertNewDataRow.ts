import {EditableTableComponent} from '../../../editable-table-component';
import {TableCellText, TableRow} from '../../../types/tableContents';
import {RowElement} from '../../../elements/row/rowElement';
import {InsertNewColumn} from './insertNewColumn';

// REF-1
export class InsertNewDataRow {
  // prettier-ignore
  private static addCells(etc: EditableTableComponent,
      newRowData: TableRow, newRowElement: HTMLElement, contentsRowIndex: number) {
    const isHeaderRow = contentsRowIndex === 0;
    newRowData.forEach((cellText: TableCellText, columnIndex: number) => {
      if (isHeaderRow) {
        InsertNewColumn.insertToHeaderRow(etc, columnIndex, cellText as string);
      } else {
        InsertNewColumn.insertToRow(etc, newRowElement, contentsRowIndex, columnIndex, cellText as string);
      }
    });
  }

  private static createNewRowData(etc: EditableTableComponent): TableRow {
    const numberOfColumns = etc.contents[0].length;
    return new Array(numberOfColumns).fill(etc.defaultCellValue);
  }

  private static insertNewRow(etc: EditableTableComponent, contentsRowIndex: number, rowData?: TableRow) {
    const newRowData = rowData || InsertNewDataRow.createNewRowData(etc);
    const newRowElement = RowElement.create();
    const parentElement = (contentsRowIndex === 0 ? etc.headerElementRef : etc.dataElementRef) as HTMLElement;
    parentElement.insertBefore(newRowElement, parentElement.children[contentsRowIndex - 1]);
    InsertNewDataRow.addCells(etc, newRowData, newRowElement, contentsRowIndex);
    // assuming that if rowData is provided, it is already in contents
    if (rowData === undefined) etc.contents.splice(contentsRowIndex, 0, newRowData);
  }

  public static insert(etc: EditableTableComponent, contentsRowIndex: number, rowData?: TableRow) {
    InsertNewDataRow.insertNewRow(etc, contentsRowIndex, rowData);
    setTimeout(() => etc.onTableUpdate(etc.contents));
  }

  public static insertEvent(this: EditableTableComponent, contentsRowIndex: number) {
    InsertNewDataRow.insert(this, contentsRowIndex);
  }
}
