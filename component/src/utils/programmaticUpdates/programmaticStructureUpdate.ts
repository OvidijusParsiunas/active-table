import {PaginationUtils} from '../outerTableComponents/pagination/paginationUtils';
import {ProgrammaticStructureUpdateT} from '../../types/programmaticCellUpdateT';
import {InsertNewColumn} from '../insertRemoveStructure/insert/insertNewColumn';
import {InsertNewRow} from '../insertRemoveStructure/insert/insertNewRow';
import {RemoveColumn} from '../insertRemoveStructure/remove/removeColumn';
import {RemoveRow} from '../insertRemoveStructure/remove/removeRow';
import {DataUtils} from '../insertRemoveStructure/shared/dataUtils';
import {UpdateAllTableData} from './updateAllTableData';
import {ActiveTable} from '../../activeTable';

export class ProgrammaticStructureUpdate {
  private static processData(length: number, data?: (string | number)[]) {
    if (!data) return;
    if (length > data.length) return data.concat(DataUtils.createEmptyStringDataArray(length - data.length));
    if (length < data.length) return data.slice(0, length);
    return data;
  }

  // if -1 - last row, if above last index - last row, otherwise use the given index
  private static processIndex(index: number, isInsert: boolean, currentLength: number) {
    index = index > -1 ? index : currentLength;
    index = index > currentLength ? currentLength : index;
    return !isInsert && index === currentLength ? currentLength - 1 : index;
  }

  // prettier-ignore
  private static updateColumn(at: ActiveTable, isInsert: boolean, index: number, data?: (string | number)[]) {
    index = ProgrammaticStructureUpdate.processIndex(index, isInsert, at.content[0]?.length || 0);
    if (at.content.length === 0) {
      if (data) UpdateAllTableData.update(at, data.map((element) => [element]), 0, true);
    } else if (isInsert) {
      data = ProgrammaticStructureUpdate.processData(at.content.length || 0, data);
      InsertNewColumn.insert(at, index, data);
    } else if (at.content.length > 0) {
      RemoveColumn.remove(at, index);
    }
  }

  private static updatePaginationAsync(at: ActiveTable, preTimeoutPaginationNumber: number) {
    setTimeout(() => {
      if (at._pagination) {
        const newPaginationNumber = at._pagination?.activePageNumber;
        if (preTimeoutPaginationNumber !== newPaginationNumber) {
          PaginationUtils.displayRowsForDifferentButton(at, preTimeoutPaginationNumber);
        } else if (preTimeoutPaginationNumber !== 1) {
          PaginationUtils.displayRowsForDifferentButton(at, 1);
          PaginationUtils.displayRowsForDifferentButton(at, preTimeoutPaginationNumber);
        }
      }
    });
  }

  private static updateRow(at: ActiveTable, isInsert: boolean, index: number, data?: (string | number)[]) {
    index = ProgrammaticStructureUpdate.processIndex(index, isInsert, at.content.length);
    if (at.content.length === 0) {
      // updating all table as first row needs to have columns added
      if (data) UpdateAllTableData.update(at, [data], 0, true);
    } else if (isInsert) {
      const activePaginationNumber = at._pagination?.activePageNumber;
      data = ProgrammaticStructureUpdate.processData(at.content[0]?.length || 0, data);
      InsertNewRow.insert(at, index, true, data);
      setTimeout(() => ProgrammaticStructureUpdate.updatePaginationAsync(at, activePaginationNumber));
    } else {
      RemoveRow.remove(at, index);
    }
  }

  public static update(at: ActiveTable, update: ProgrammaticStructureUpdateT) {
    const {structure, isInsert, index, data} = update;
    if (typeof isInsert !== 'boolean' || typeof index !== 'number') return;
    if (structure === 'row') {
      ProgrammaticStructureUpdate.updateRow(at, isInsert, index, data);
    } else if (structure === 'column') {
      ProgrammaticStructureUpdate.updateColumn(at, isInsert, index, data);
    }
  }
}
