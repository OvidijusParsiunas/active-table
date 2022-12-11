import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewRowElement} from '../../../elements/table/addNewElements/row/addNewRowElement';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellTypeTotalsUtils} from '../../columnType/cellTypeTotalsUtils';
import {IndexColumn} from '../../../elements/indexColumn/indexColumn';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {CellText, TableRow} from '../../../types/tableContents';
import {UpdateCellsForRows} from '../update/updateCellsForRows';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {HasRerendered} from '../../render/hasRerendered';

export class RemoveRow {
  private static updateColumnDetails(removedRowData: TableRow, columnsDetails: ColumnsDetailsT) {
    removedRowData.forEach((cellText: CellText, columnIndex: number) => {
      CellTypeTotalsUtils.decrementCellType(columnsDetails[columnIndex], cellText as string); // CAUTION-2
    });
  }

  // when the last row has been removed, there are no more columns
  private static removeAllColumnsDetails(columnsDetails: ColumnsDetailsT) {
    columnsDetails.splice(0, columnsDetails.length);
  }

  // prettier-ignore
  private static update(etc: EditableTableComponent,
      rowIndex: number, lastRowElement: HTMLElement, lastRowIndex: number, removedRowData: TableRow) {
    const lastRow = {element: lastRowElement, index: lastRowIndex};
    UpdateCellsForRows.rebindAndFireUpdates(etc, rowIndex, CELL_UPDATE_TYPE.REMOVED, lastRow); // REF-20
    etc.onTableUpdate(etc.contents);
    if (HasRerendered.check(etc.columnsDetails)) return; // CAUTION-2
    if (etc.contents.length === 0) {
      RemoveRow.removeAllColumnsDetails(etc.columnsDetails);
    } else {
      RemoveRow.updateColumnDetails(removedRowData, etc.columnsDetails);
    }
    etc.addColumnCellsElementsRef.splice(rowIndex, 1);
  }

  private static removeRow(etc: EditableTableComponent, rowIndex: number) {
    etc.tableBodyElementRef?.children[rowIndex].remove();
    const removedContentRow = etc.contents.splice(rowIndex, 1);
    // needs to be done synchronously as add new row toggle needs elements count when calling MaximumRows.canAddMore
    removedContentRow[0].forEach((_, columnIndex: number) => {
      etc.columnsDetails[columnIndex].elements.splice(rowIndex, 1);
      etc.columnsDetails[columnIndex].processedStyle.splice(rowIndex, 1);
    });
    return removedContentRow[0];
  }

  public static remove(etc: EditableTableComponent, rowIndex: number) {
    const lastRowIndex = etc.contents.length - 1;
    const lastRowElement = etc.tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    const removedRowData = RemoveRow.removeRow(etc, rowIndex);
    ToggleAdditionElements.update(etc, false, AddNewRowElement.toggle);
    if (etc.auxiliaryTableContentInternal.displayIndexColumn) IndexColumn.updateIndexes(etc, rowIndex);
    setTimeout(() => RemoveRow.update(etc, rowIndex, lastRowElement, lastRowIndex, removedRowData));
  }
}
