import {PageButtonContainerElement} from '../../../../elements/pagination/pageButtons/pageButtonContainerElement';
import {UpdateCellsForRows} from '../../../insertRemoveStructure/update/updateCellsForRows';
import {AsyncStartData, PaginationInternal} from '../../../../types/paginationInternal';
import {InsertNewRow} from '../../../insertRemoveStructure/insert/insertNewRow';
import {InitialDataProcessing} from '../../../data/initialDataProcessing';
import {CELL_UPDATE_TYPE} from '../../../../enums/onUpdateCellType';
import {PaginationAsyncUtils} from './paginationAsyncUtils';
import {Pagination} from '../../../../types/pagination';
import {EMPTY_STRING} from '../../../../consts/text';
import {ActiveTable} from '../../../../activeTable';

export class PaginationAsyncStartData {
  private static fillTotalDataRows(at: ActiveTable, asyncStartData: AsyncStartData) {
    const {totalDataRows, data: asyncData, failed} = asyncStartData;
    if (at.data.length < totalDataRows || failed) {
      const maxRowLength = Math.max(at.data[0]?.length || 0, InitialDataProcessing.getMaxRowLength(asyncData));
      const headerDelta = Number(!at.dataStartsAtHeader);
      const newData = new Array(totalDataRows - at.data.length + headerDelta).fill(
        new Array(maxRowLength).fill(EMPTY_STRING)
      );
      const startIndex = at.data.length;
      at.data.splice(at.data.length, 0, ...newData);
      newData.forEach((row, index) => {
        const rowEl = InsertNewRow.insertNewRow(at, startIndex + index, false, row);
        setTimeout(() => {
          UpdateCellsForRows.updateRowCells(at, rowEl, startIndex + index, CELL_UPDATE_TYPE.UPDATE, false);
        });
      });
      PageButtonContainerElement.repopulateButtons(at);
    }
  }

  public static populate(at: ActiveTable, startData: AsyncStartData) {
    const {data, totalDataRows, failed} = startData;
    if (data.length > 0 && totalDataRows > 0 && (at.data.length > 0 || InitialDataProcessing.getMaxRowLength(data) > 0)) {
      PaginationAsyncStartData.fillTotalDataRows(at, startData);
      if (!failed) PaginationAsyncUtils.insertData(at, data, 1);
    }
  }

  public static async get(at: ActiveTable, pagination: Pagination, paginationInternal: PaginationInternal) {
    const {async, rowsPerPage: rowsPerPageC} = pagination;
    if (!async) return;
    const {rowsPerPage: rowsPerPageI} = paginationInternal;
    const rowsPerPage = typeof rowsPerPageC === 'number' ? rowsPerPageC : rowsPerPageI;
    try {
      // not handling partial failures because users would be looking at partial data without knowing about it
      const [totalDataRows, data] = await Promise.all([async.getTotalRows(), async.getPageData(1, rowsPerPage)]);
      return {totalDataRows, data};
    } catch (e) {
      setTimeout(() => PaginationAsyncUtils.displayError(e, at));
      return {totalDataRows: 0, data: [['', '']], failed: true};
    }
  }
}
