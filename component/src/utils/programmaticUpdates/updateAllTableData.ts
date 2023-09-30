import {ToggleAdditionElements} from '../../elements/table/addNewElements/shared/toggleAdditionElements';
import {RootCellElement} from '../../elements/table/addNewElements/rootCell/rootCellElement';
import {FilterInternalUtils} from '../outerTableComponents/filter/rows/filterInternalUtils';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationUtils} from '../outerTableComponents/pagination/paginationUtils';
import {InitialContentProcessing} from '../content/initialContentProcessing';
import {RemoveRow} from '../insertRemoveStructure/remove/removeRow';
import {TableContent} from '../../types/tableContent';
import {ActiveTable} from '../../activeTable';
import {InsertMatrix} from './insertMatrix';

export class UpdateAllTableData {
  private static toggleAdditionalElements(at: ActiveTable) {
    FilterInternalUtils.completeReset(at);
    // updateRowsOnNewInsert sets uses activePageNumber + 1
    if (at._pagination && at._pagination.activePageNumber !== 1) PaginationUtils.displayRowsForDifferentButton(at, 1);
    ToggleAdditionElements.update(at, true, AddNewRowElement.toggle);
  }

  private static insertData(at: ActiveTable, content: TableContent, startRowIndex: number) {
    InsertMatrix.insert(at, content, startRowIndex, 0, true);
    if (startRowIndex === 0) {
      RootCellElement.convertFromRootCell(at);
    }
  }

  private static changeTableData(at: ActiveTable, content: TableContent, startRowIndex: number, forceSync: boolean) {
    for (let i = at.content.length - 1; i >= startRowIndex; i -= 1) {
      RemoveRow.remove(at, i);
    }
    InitialContentProcessing.preProcess(at, content);
    at._isPopulatingTable = true;
    if (forceSync) {
      UpdateAllTableData.insertData(at, content, startRowIndex);
      UpdateAllTableData.toggleAdditionalElements(at);
      at._isPopulatingTable = true;
    } else {
      setTimeout(() => {
        // in a timeout because RemoveRow.remove contains processes inside timeouts e.g. remove column details
        UpdateAllTableData.insertData(at, content, startRowIndex);
      });
      setTimeout(() => {
        // in a timeout as at.shadowRoot.contains does not work immediately
        UpdateAllTableData.toggleAdditionalElements(at);
        at._isPopulatingTable = true;
      }, 6);
    }
  }

  public static update(at: ActiveTable, content: TableContent, startRowIndex: number, forceSync = false) {
    if (!Array.isArray(content)) return;
    let waitForFilterUnset = false;
    if (at._visiblityInternal.filters) {
      waitForFilterUnset = FilterInternalUtils.unsetAllFilters(at);
    }
    if (!forceSync && waitForFilterUnset) {
      // need to wait for inputElement.dispatchEvent(new Event('input')) when unsetting
      setTimeout(() => UpdateAllTableData.changeTableData(at, content, startRowIndex, forceSync), 40);
    } else {
      UpdateAllTableData.changeTableData(at, content, startRowIndex, forceSync);
    }
  }
}
