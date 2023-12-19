import {ToggleAdditionElements} from '../../../elements/table/addNewElements/shared/toggleAdditionElements';
import {AddNewRowElement} from '../../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationUtils} from '../../outerTableComponents/pagination/paginationUtils';
import {IndexColumn} from '../../../elements/indexColumn/indexColumn';
import {CustomRowProperties} from '../../rows/customRowProperties';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {UpdateCellsForRows} from '../update/updateCellsForRows';
import {MoveRow} from '../../moveStructure/moveRow';
import {FireEvents} from '../../events/fireEvents';
import {ActiveTable} from '../../../activeTable';
import {RemoveColumn} from './removeColumn';

export class RemoveRow {
  // when the last row has been removed, there are no more columns
  private static removeAllColumnsDetails(at: ActiveTable) {
    const {_columnsDetails} = at;
    _columnsDetails.forEach((columnDetails) => RemoveColumn.reduceStaticWidthTotal(at, columnDetails.settings));
    _columnsDetails.splice(0, _columnsDetails.length);
  }

  private static update(at: ActiveTable, rowIndex: number, lastRowElement: HTMLElement, lastRowIndex: number) {
    const lastRow = {element: lastRowElement, index: lastRowIndex};
    UpdateCellsForRows.rebindAndFireUpdates(at, rowIndex, CELL_UPDATE_TYPE.REMOVED, lastRow); // REF-20
    setTimeout(() => FireEvents.onDataUpdate(at));
    if (at._isRendering) return;
    if (at.data.length === 0) RemoveRow.removeAllColumnsDetails(at);
    at._addColumnCellsElementsRef.splice(rowIndex, 1);
  }

  private static rowToBeRemovedIndexWhenPagination(at: ActiveTable, rowIndex: number) {
    const rowToBeRemoved = at._tableBodyElementRef?.children[rowIndex];
    return at._pagination.visibleRows.findIndex((row) => row === rowToBeRemoved);
  }

  private static removeRow(at: ActiveTable, rowIndex: number) {
    const index = at.pagination ? RemoveRow.rowToBeRemovedIndexWhenPagination(at, rowIndex) : 0; // before it is removed
    at._tableBodyElementRef?.children[rowIndex].remove();
    at._rowDropdownCellOverlays.splice(rowIndex, 1);
    const removedDataRow = at.data.splice(rowIndex, 1);
    // needs to be done synchronously as add new row toggle needs elements count when calling MaximumRows.canAddMore
    removedDataRow[0].forEach((_, columnIndex: number) => {
      at._columnsDetails[columnIndex].elements.splice(rowIndex, 1);
      at._columnsDetails[columnIndex].processedStyle.splice(rowIndex, 1);
    });
    if (at.pagination) PaginationUtils.updateOnRowChange(at, index);
    return removedDataRow[0];
  }

  // REF-27
  private static changeRowIndexIfRemoveHeaderWithDataBelow(at: ActiveTable, rowIndex: number) {
    const isHeaderRowWithDataBelow = rowIndex === 0 && at._columnsDetails[0].elements.length > 1;
    if (isHeaderRowWithDataBelow) {
      MoveRow.move(at, 0, true);
      return 1;
    }
    return rowIndex;
  }

  public static remove(at: ActiveTable, rowIndex: number) {
    rowIndex = RemoveRow.changeRowIndexIfRemoveHeaderWithDataBelow(at, rowIndex);
    const lastRowIndex = at.data.length - 1;
    const lastRowElement = at._tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    RemoveRow.removeRow(at, rowIndex);
    ToggleAdditionElements.update(at, false, AddNewRowElement.toggle);
    if (at._frameComponents.displayIndexColumn) IndexColumn.updateIndexes(at, rowIndex);
    CustomRowProperties.update(at, rowIndex);
    setTimeout(() => RemoveRow.update(at, rowIndex, lastRowElement, lastRowIndex));
  }
}
