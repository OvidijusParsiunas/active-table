import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewRowElement} from '../../../elements/table/addNewElements/row/addNewRowElement';
import {IndexColumn} from '../../../elements/table/indexColumn/indexColumn';
import {EditableTableComponent} from '../../../editable-table-component';
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

  // when the last row has been removed, there are no more columns
  private static removeAllColumnsDetails(columnsDetails: ColumnsDetailsT) {
    columnsDetails.splice(0, columnsDetails.length);
  }

  // CAUTION-2 - TO-DO recheck this after a button has been added to remove a row
  // prettier-ignore
  private static update(etc: EditableTableComponent,
      rowIndex: number, lastRowElement: HTMLElement, lastRowIndex: number, removedRowData: TableRow) {
    const lastRow = {element: lastRowElement, index: lastRowIndex};
    UpdateCellsForRows.rebindAndFireUpdates(etc, rowIndex, CELL_UPDATE_TYPE.REMOVED, lastRow);
    etc.onTableUpdate(etc.contents);
    if (etc.contents.length === 0) {
      RemoveRow.removeAllColumnsDetails(etc.columnsDetails);
    } else {
      RemoveRow.updateColumnDetails(removedRowData, etc.defaultCellValue, etc.columnsDetails, rowIndex);
    }
    etc.addColumnCellsElementsRef.splice(rowIndex, 1);
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
    ToggleAdditionElements.update(etc, false, AddNewRowElement.toggle);
    if (etc.displayIndexColumn) IndexColumn.updateIndexes(etc.tableBodyElementRef as HTMLElement, etc.contents, rowIndex);
    setTimeout(() => RemoveRow.update(etc, rowIndex, lastRowElement, lastRowIndex, removedRowData));
  }
}
