import {EditableTableComponent} from '../../../editable-table-component';
import {AddNewRowElement} from '../../../elements/row/addNewRowElement';
import {CellTypeTotalsUtils} from '../../cellType/cellTypeTotalsUtils';
import {TableCellText, TableRow} from '../../../types/tableContents';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {UpdateCellsForRows} from '../update/updateCellsForRows';
import {ColumnsDetailsT} from '../../../types/columnDetails';

export class RemoveRow {
  // prettier-ignore
  private static updateColumnDetails(
      removedRowData: TableRow, defaultCellValue: string, columnsDetails: ColumnsDetailsT, rowIndex: number) {
    removedRowData.forEach((cellText: TableCellText, columnIndex: number) => {
      const columnDetails = columnsDetails[columnIndex];
      columnDetails.elements.splice(rowIndex, 1);
      // CAUTION-2
      CellTypeTotalsUtils.decrementCellTypeAndSetNewColumnType(columnDetails, defaultCellValue, cellText as string);
    });
  }

  // prettier-ignore
  private static update(etc: EditableTableComponent,
      rowIndex: number, lastRowElement: HTMLElement, lastRowIndex: number, removedRowData: TableRow) {
    const lastRow = {element: lastRowElement, index: lastRowIndex};
    UpdateCellsForRows.rebindAndFireUpdates(etc, rowIndex, CELL_UPDATE_TYPE.REMOVED, lastRow);
    etc.onTableUpdate(etc.contents);
    setTimeout(() => {
      RemoveRow.updateColumnDetails(removedRowData, etc.defaultCellValue, etc.columnsDetails, rowIndex);
      AddNewRowElement.toggle(etc);
    });
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
