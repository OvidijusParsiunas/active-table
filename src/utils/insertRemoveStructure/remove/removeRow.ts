import {CellTypeTotalsUtils} from '../../cellTypeTotals/cellTypeTotalsUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {TableCellText, TableRow} from '../../../types/tableContents';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {UpdateCellsForRows} from '../update/updateCellsForRows';
import {ColumnsDetailsT} from '../../../types/columnDetails';

export class RemoveRow {
  // prettier-ignore
  private static decrementColumnCellTypeTotals(
      removedRowData: TableRow, defaultCellValue: string, columnsDetails: ColumnsDetailsT) {
    removedRowData.forEach((cellText: TableCellText, columnIndex: number) => {
      CellTypeTotalsUtils.decrementCellTypeAndSetNewColumnType(
        columnsDetails[columnIndex], defaultCellValue, cellText as string);
    });
  }
  // prettier-ignore
  private static update(etc: EditableTableComponent,
      rowIndex: number, lastRowElement: HTMLElement, lastRowIndex: number, removedRowData: TableRow) {
    const lastRow = {element: lastRowElement, index: lastRowIndex};
    UpdateCellsForRows.rebindAndFireUpdates(etc, rowIndex, CELL_UPDATE_TYPE.REMOVED, lastRow);
    etc.onTableUpdate(etc.contents);
    setTimeout(() =>  RemoveRow.decrementColumnCellTypeTotals(removedRowData, etc.defaultCellValue, etc.columnsDetails));
  }

  private static removeRow(etc: EditableTableComponent, rowIndex: number) {
    etc.tableBodyElementRef?.removeChild(etc.tableBodyElementRef.children[rowIndex]);
    const removedContentRow = etc.contents.splice(rowIndex, 1);
    return removedContentRow[0];
  }

  public static remove(etc: EditableTableComponent, rowIndex: number) {
    const lastRowIndex = etc.contents.length - 1;
    const lastRowElement = etc.tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    const removedRowData = RemoveRow.removeRow(etc, rowIndex);
    setTimeout(() => RemoveRow.update(etc, rowIndex, lastRowElement, lastRowIndex, removedRowData));
  }
}
