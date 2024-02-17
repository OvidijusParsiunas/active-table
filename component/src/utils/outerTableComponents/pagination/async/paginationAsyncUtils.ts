import {UpdateIndexColumnWidth} from '../../../../elements/indexColumn/updateIndexColumnWidth';
import {Pagination, PaginationAsync} from '../../../../types/pagination';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {ColumnTypesUtils} from '../../../columnType/columnTypesUtils';
import {CellEvents} from '../../../../elements/cell/cellEvents';
import {CellText, TableData} from '../../../../types/tableData';
import {LoadingElement} from '../../loading/loadingElement';
import {ErrorElement} from '../../error/errorElement';
import {ActiveTable} from '../../../../activeTable';
import {PaginationUtils} from '../paginationUtils';

export class PaginationAsyncUtils {
  private static displayError(e: unknown, at: ActiveTable) {
    ErrorElement.display(at);
    console.error(e);
    console.error('Error fetching page information');
  }

  // prettier-ignore
  private static setNewElementText(at: ActiveTable, newText: CellText, targetCellElement: HTMLElement,
      columnIndex: number, rowIndex: number) {
    CellEvents.updateCell(at, newText, rowIndex, columnIndex,
      {element: targetCellElement, processText: false, updateCellEvent: false, updateTableEvent: false});
    ColumnTypesUtils.updateDataElements(at, rowIndex, columnIndex, targetCellElement);
  }

  public static insertData(at: ActiveTable, data: TableData, buttonNumber: number) {
    const headerDelta = at.dataStartsAtHeader ? 0 : 1;
    const startIndex = (buttonNumber - 1) * 10 + headerDelta;
    if (data.length > at._pagination.rowsPerPage) {
      // if returning more rows for one page
      data = data.slice(0, at._pagination.rowsPerPage);
    }
    if (startIndex + data.length > at.data.length) {
      // if returning more data than total rows
      data = data.slice(0, data.length - (startIndex + data.length - at.data.length));
    }
    data.forEach((row, rowIndex) => {
      row.forEach((cellData, columnIndex) => {
        const actualRowIndex = startIndex + rowIndex;
        const cellElement = at._columnsDetails[columnIndex].elements[actualRowIndex];
        PaginationAsyncUtils.setNewElementText(at, cellData as string, cellElement, columnIndex, actualRowIndex);
      });
    });
    UpdateIndexColumnWidth.update(at);
  }

  public static async getAndApplyNewData(at: ActiveTable, async: PaginationAsync, buttonNumber: number, id: unknown) {
    at._pagination.asyncGetId = id;
    ErrorElement.remove(at);
    LoadingElement.addActive(at);
    let data: TableData = [[]];
    try {
      data = await async.getPageData(buttonNumber, at._pagination.rowsPerPage);
      if (at._pagination.asyncGetId !== id) return;
    } catch (e) {
      PaginationAsyncUtils.displayError(e, at);
    }
    PaginationAsyncUtils.insertData(at, data, buttonNumber);
    at._activeOverlayElements.loading?.remove();
    PaginationUtils.displayRowsForDifferentButton(at, buttonNumber);
  }

  public static async getStartDetails(at: ActiveTable, pagination: Pagination, paginationInternal: PaginationInternal) {
    const {_async, rowsPerPage: rowsPerPageC} = pagination;
    if (!_async) return;
    const {rowsPerPage: rowsPerPageI} = paginationInternal;
    const rowsPerPage = typeof rowsPerPageC === 'number' ? rowsPerPageC : rowsPerPageI;
    try {
      // not handling partial failures because users would be looking at partial data without knowing about it
      const [totalRows, data] = await Promise.all([_async.getTotalRows(), _async.getPageData(1, rowsPerPage)]);
      return {totalRows, data};
    } catch (e) {
      setTimeout(() => PaginationAsyncUtils.displayError(e, at));
      return {totalRows: 0, data: [['', '']], failed: true};
    }
  }
}
