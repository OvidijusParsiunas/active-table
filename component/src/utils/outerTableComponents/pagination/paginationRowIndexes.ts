import {PaginationInternal} from '../../../types/paginationInternal';
import {ActiveTable} from '../../../activeTable';

export class PaginationRowIndexes {
  public static getVisibleRowRealIndex(tableBody: HTMLElement, pagination: PaginationInternal, index?: number) {
    const rows = Array.from(tableBody.children);
    const rowIndex = index === undefined ? pagination.visibleRows.length - 1 : index;
    const visibleRow = pagination.visibleRows[rowIndex];
    return rows.findIndex((row) => row === visibleRow);
  }

  public static getVisibleRowIndex(tableBody: HTMLElement, pagination: PaginationInternal, index: number) {
    const currentElement = tableBody.children[index];
    return pagination.visibleRows.findIndex((row) => row === currentElement);
  }

  private static getFilteredMaxVisibleRowIndex(tableBodyElement: HTMLElement, pagination: PaginationInternal) {
    const {rowsPerPage, visibleRows} = pagination;
    const rowIndex = PaginationRowIndexes.getVisibleRowRealIndex(tableBodyElement, pagination);
    if (visibleRows.length === rowsPerPage) return rowIndex;
    return rowIndex + (rowsPerPage - visibleRows.length);
  }

  private static getRawMaxVisibleRowIndex(at: ActiveTable) {
    const {_pagination, _tableBodyElementRef, content, _visiblityInternal} = at;
    const {activePageNumber, rowsPerPage, isAllRowsOptionSelected} = _pagination;
    if (isAllRowsOptionSelected) {
      return content.length + 1;
    }
    if (_visiblityInternal.filters) {
      return PaginationRowIndexes.getFilteredMaxVisibleRowIndex(_tableBodyElementRef as HTMLElement, _pagination);
    }
    return activePageNumber * rowsPerPage;
  }

  public static getMaxVisibleRowIndex(at: ActiveTable) {
    const {dataStartsAtHeader} = at;
    let maxVisibleRowIndex = PaginationRowIndexes.getRawMaxVisibleRowIndex(at);
    if (!dataStartsAtHeader) maxVisibleRowIndex += 1;
    return maxVisibleRowIndex;
  }
}
