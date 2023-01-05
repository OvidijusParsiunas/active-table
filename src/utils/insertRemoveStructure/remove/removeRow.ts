import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewRowElement} from '../../../elements/table/addNewElements/row/addNewRowElement';
import {EditableTableComponent} from '../../../editable-table-component';
import {CellTypeTotalsUtils} from '../../columnType/cellTypeTotalsUtils';
import {IndexColumn} from '../../../elements/indexColumn/indexColumn';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {PaginationUtils} from '../../pagination/paginationUtils';
import {CellText, TableRow} from '../../../types/tableContents';
import {UpdateCellsForRows} from '../update/updateCellsForRows';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {StripedRows} from '../../stripedRows/stripedRows';
import {HasRerendered} from '../../render/hasRerendered';
import {MoveRow} from '../../moveStructure/moveRow';
import {RemoveColumn} from './removeColumn';

export class RemoveRow {
  private static updateColumnDetails(removedRowData: TableRow, columnsDetails: ColumnsDetailsT) {
    removedRowData.forEach((cellText: CellText, columnIndex: number) => {
      CellTypeTotalsUtils.decrementCellType(columnsDetails[columnIndex], cellText as string); // CAUTION-2
    });
  }

  // when the last row has been removed, there are no more columns
  private static removeAllColumnsDetails(etc: EditableTableComponent) {
    const {columnsDetails} = etc;
    columnsDetails.forEach((columnDetails) => RemoveColumn.reduceStaticWidthTotal(etc, columnDetails));
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
      RemoveRow.removeAllColumnsDetails(etc);
    } else {
      RemoveRow.updateColumnDetails(removedRowData, etc.columnsDetails);
    }
    etc.addColumnCellsElementsRef.splice(rowIndex, 1);
  }

  private static removeRow(etc: EditableTableComponent, rowIndex: number) {
    etc.tableBodyElementRef?.children[rowIndex].remove();
    etc.rowDropdownCellOverlays.splice(rowIndex, 1);
    const removedContentRow = etc.contents.splice(rowIndex, 1);
    // needs to be done synchronously as add new row toggle needs elements count when calling MaximumRows.canAddMore
    removedContentRow[0].forEach((_, columnIndex: number) => {
      etc.columnsDetails[columnIndex].elements.splice(rowIndex, 1);
      etc.columnsDetails[columnIndex].processedStyle.splice(rowIndex, 1);
    });
    if (etc.pagination) PaginationUtils.updateOnRowChange(etc, rowIndex);
    return removedContentRow[0];
  }

  // REF-27
  private static changeRowIndexIfRemoveHeaderWithDataBelow(etc: EditableTableComponent, rowIndex: number) {
    const isHeaderRowWithDataBelow = rowIndex === 0 && etc.columnsDetails[0].elements.length > 1;
    if (isHeaderRowWithDataBelow) {
      MoveRow.move(etc, 0, true);
      return 1;
    }
    return rowIndex;
  }

  public static remove(etc: EditableTableComponent, rowIndex: number) {
    rowIndex = RemoveRow.changeRowIndexIfRemoveHeaderWithDataBelow(etc, rowIndex);
    const lastRowIndex = etc.contents.length - 1;
    const lastRowElement = etc.tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    const removedRowData = RemoveRow.removeRow(etc, rowIndex);
    ToggleAdditionElements.update(etc, false, AddNewRowElement.toggle);
    if (etc.auxiliaryTableContentInternal.displayIndexColumn) IndexColumn.updateIndexes(etc, rowIndex);
    StripedRows.updateRows(etc, rowIndex);
    setTimeout(() => RemoveRow.update(etc, rowIndex, lastRowElement, lastRowIndex, removedRowData));
  }
}
