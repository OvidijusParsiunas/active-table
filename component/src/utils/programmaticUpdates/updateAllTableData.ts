import {ToggleAdditionElements} from '../../elements/table/addNewElements/shared/toggleAdditionElements';
import {RootCellElement} from '../../elements/table/addNewElements/rootCell/rootCellElement';
import {FilterInternalUtils} from '../outerTableComponents/filter/rows/filterInternalUtils';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationUtils} from '../outerTableComponents/pagination/paginationUtils';
import {RemoveRow} from '../insertRemoveStructure/remove/removeRow';
import {InitialDataProcessing} from '../data/initialDataProcessing';
import {TableData} from '../../types/tableData';
import {ActiveTable} from '../../activeTable';
import {InsertMatrix} from './insertMatrix';

export class UpdateAllTableData {
  private static toggleAdditionalElements(at: ActiveTable) {
    FilterInternalUtils.completeReset(at);
    // updateRowsOnNewInsert sets uses activePageNumber + 1
    if (at._pagination && at._pagination.activePageNumber !== 1) PaginationUtils.displayRowsForDifferentButton(at, 1);
    ToggleAdditionElements.update(at, true, AddNewRowElement.toggle);
  }

  private static insertData(at: ActiveTable, data: TableData, startRowIndex: number) {
    InsertMatrix.insert(at, data, startRowIndex, 0, true);
    if (startRowIndex === 0) {
      RootCellElement.convertFromRootCell(at);
    }
  }

  private static changeTableData(at: ActiveTable, data: TableData, startRowIndex: number, forceSync: boolean) {
    for (let i = at.data.length - 1; i >= startRowIndex; i -= 1) {
      RemoveRow.remove(at, i);
    }
    InitialDataProcessing.preProcess(at, data);
    at._isPopulatingTable = true;
    if (forceSync) {
      UpdateAllTableData.insertData(at, data, startRowIndex);
      UpdateAllTableData.toggleAdditionalElements(at);
      at._isPopulatingTable = true;
    } else {
      setTimeout(() => {
        // in a timeout because RemoveRow.remove contains processes inside timeouts e.g. remove column details
        UpdateAllTableData.insertData(at, data, startRowIndex);
      });
      setTimeout(() => {
        // in a timeout as at.shadowRoot.contains does not work immediately
        UpdateAllTableData.toggleAdditionalElements(at);
        at._isPopulatingTable = true;
      }, 6);
    }
  }

  public static update(at: ActiveTable, data: TableData, startRowIndex: number, forceSync = false) {
    if (!Array.isArray(data)) return;
    let waitForFilterUnset = false;
    if (at._visiblityInternal.filters) {
      waitForFilterUnset = FilterInternalUtils.unsetAllFilters(at);
    }
    if (!forceSync && waitForFilterUnset) {
      // need to wait for inputElement.dispatchEvent(new Event('input')) when unsetting
      setTimeout(() => UpdateAllTableData.changeTableData(at, data, startRowIndex, forceSync), 40);
    } else {
      UpdateAllTableData.changeTableData(at, data, startRowIndex, forceSync);
    }
  }
}
