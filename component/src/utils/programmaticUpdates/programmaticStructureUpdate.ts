import {PaginationUtils} from '../outerTableComponents/pagination/paginationUtils';
import {ProgrammaticStructureUpdateT} from '../../types/programmaticCellUpdateT';
import {InsertNewColumn} from '../insertRemoveStructure/insert/insertNewColumn';
import {InsertNewRow} from '../insertRemoveStructure/insert/insertNewRow';
import {RemoveColumn} from '../insertRemoveStructure/remove/removeColumn';
import {RemoveRow} from '../insertRemoveStructure/remove/removeRow';
import {ActiveTable} from '../../activeTable';

export class ProgrammaticStructureUpdate {
  public static update(at: ActiveTable, update: ProgrammaticStructureUpdateT) {
    const {structure, isInsert, data} = update;
    let index = Math.max(0, update.index);
    if (structure === 'row') {
      index = index > at.content.length ? at.content.length : index;
      const activePaginationNumber = at._pagination?.activePageNumber;
      if (isInsert) {
        InsertNewRow.insert(at, index, true, data);
      } else {
        RemoveRow.remove(at, index);
      }
      setTimeout(() => {
        if (at._pagination) {
          const newPaginationNumber = at._pagination?.activePageNumber;
          if (activePaginationNumber !== newPaginationNumber) {
            PaginationUtils.displayRowsForDifferentButton(at, activePaginationNumber);
          } else if (activePaginationNumber !== 1) {
            PaginationUtils.displayRowsForDifferentButton(at, 1);
            PaginationUtils.displayRowsForDifferentButton(at, activePaginationNumber);
          }
        }
      });
    } else if (structure === 'column') {
      if (isInsert) {
        InsertNewColumn.insert(at, index, data);
      } else {
        RemoveColumn.remove(at, index);
      }
    }
  }
}
