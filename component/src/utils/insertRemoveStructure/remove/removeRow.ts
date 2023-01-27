import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewRowElement} from '../../../elements/table/addNewElements/row/addNewRowElement';
import {CellTypeTotalsUtils} from '../../columnType/cellTypeTotalsUtils';
import {IndexColumn} from '../../../elements/indexColumn/indexColumn';
import {CustomRowProperties} from '../../rows/customRowProperties';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {PaginationUtils} from '../../pagination/paginationUtils';
import {UpdateCellsForRows} from '../update/updateCellsForRows';
import {CellText, TableRow} from '../../../types/tableContent';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {HasRerendered} from '../../render/hasRerendered';
import {MoveRow} from '../../moveStructure/moveRow';
import {ActiveTable} from '../../../activeTable';
import {RemoveColumn} from './removeColumn';

export class RemoveRow {
  private static updateColumnDetails(removedRowData: TableRow, columnsDetails: ColumnsDetailsT) {
    removedRowData.forEach((cellText: CellText, columnIndex: number) => {
      CellTypeTotalsUtils.decrementCellType(columnsDetails[columnIndex], cellText as string); // CAUTION-2
    });
  }

  // when the last row has been removed, there are no more columns
  private static removeAllColumnsDetails(at: ActiveTable) {
    const {columnsDetails} = at;
    columnsDetails.forEach((columnDetails) => RemoveColumn.reduceStaticWidthTotal(at, columnDetails.settings));
    columnsDetails.splice(0, columnsDetails.length);
  }

  // prettier-ignore
  private static update(at: ActiveTable,
      rowIndex: number, lastRowElement: HTMLElement, lastRowIndex: number, removedRowData: TableRow) {
    const lastRow = {element: lastRowElement, index: lastRowIndex};
    UpdateCellsForRows.rebindAndFireUpdates(at, rowIndex, CELL_UPDATE_TYPE.REMOVED, lastRow); // REF-20
    at.onTableUpdate(at.content);
    if (HasRerendered.check(at.columnsDetails)) return; // CAUTION-2
    if (at.content.length === 0) {
      RemoveRow.removeAllColumnsDetails(at);
    } else {
      RemoveRow.updateColumnDetails(removedRowData, at.columnsDetails);
    }
    at.addColumnCellsElementsRef.splice(rowIndex, 1);
  }

  private static removeRow(at: ActiveTable, rowIndex: number) {
    at.tableBodyElementRef?.children[rowIndex].remove();
    at.rowDropdownCellOverlays.splice(rowIndex, 1);
    const removedContentRow = at.content.splice(rowIndex, 1);
    // needs to be done synchronously as add new row toggle needs elements count when calling MaximumRows.canAddMore
    removedContentRow[0].forEach((_, columnIndex: number) => {
      at.columnsDetails[columnIndex].elements.splice(rowIndex, 1);
      at.columnsDetails[columnIndex].processedStyle.splice(rowIndex, 1);
    });
    if (at.pagination) PaginationUtils.updateOnRowChange(at, rowIndex);
    return removedContentRow[0];
  }

  // REF-27
  private static changeRowIndexIfRemoveHeaderWithDataBelow(at: ActiveTable, rowIndex: number) {
    const isHeaderRowWithDataBelow = rowIndex === 0 && at.columnsDetails[0].elements.length > 1;
    if (isHeaderRowWithDataBelow) {
      MoveRow.move(at, 0, true);
      return 1;
    }
    return rowIndex;
  }

  public static remove(at: ActiveTable, rowIndex: number) {
    rowIndex = RemoveRow.changeRowIndexIfRemoveHeaderWithDataBelow(at, rowIndex);
    const lastRowIndex = at.content.length - 1;
    const lastRowElement = at.tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    const removedRowData = RemoveRow.removeRow(at, rowIndex);
    ToggleAdditionElements.update(at, false, AddNewRowElement.toggle);
    if (at.auxiliaryTableContentInternal.displayIndexColumn) IndexColumn.updateIndexes(at, rowIndex);
    CustomRowProperties.update(at, rowIndex);
    setTimeout(() => RemoveRow.update(at, rowIndex, lastRowElement, lastRowIndex, removedRowData));
  }
}
