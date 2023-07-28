import {ToggleAdditionElements} from '../../elements/table/addNewElements/shared/toggleAdditionElements';
import {NoContentStubElement} from '../../elements/table/addNewElements/shared/noContentStubElement';
import {FilterInternalUtils} from '../outerTableComponents/filter/rows/filterInternalUtils';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationUtils} from '../outerTableComponents/pagination/paginationUtils';
import {InitialContentProcessing} from '../content/initialContentProcessing';
import {RemoveRow} from '../insertRemoveStructure/remove/removeRow';
import {TableContent} from '../../types/tableContent';
import {ActiveTable} from '../../activeTable';
import {InsertMatrix} from './insertMatrix';

export class UpdateAllTableData {
  private static changeTableData(at: ActiveTable, content: TableContent, startRowIndex: number) {
    for (let i = at.content.length - 1; i >= startRowIndex; i -= 1) {
      RemoveRow.remove(at, i);
    }
    InitialContentProcessing.preProcess(at, content);
    at._isPopulatingTable = true;
    // in a timeout because RemoveRow.remove contains processes inside timeouts e.g. remove column details
    setTimeout(() => {
      InsertMatrix.insert(at, content, startRowIndex, 0, true);
      if (startRowIndex === 0) {
        NoContentStubElement.convertFromStub({target: at._addRowCellElementRef as HTMLElement});
      }
    });
    setTimeout(() => {
      // in a timeout as at.shadowRoot.contains does not work immediately
      FilterInternalUtils.completeReset(at);
      // updateRowsOnNewInsert sets uses activePageNumber + 1
      if (at._pagination && at._pagination.activePageNumber !== 1) PaginationUtils.displayRowsForDifferentButton(at, 1);
      ToggleAdditionElements.update(at, true, AddNewRowElement.toggle);
      at._isPopulatingTable = false;
    }, 6);
  }

  public static update(at: ActiveTable, content: TableContent, startRowIndex: number) {
    if (!Array.isArray(content)) return;
    let waitForFilterUnset = false;
    if (at._visiblityInternal.rows) {
      waitForFilterUnset = FilterInternalUtils.unsetAllFilters(at);
    }
    if (waitForFilterUnset) {
      // need to wait for inputElement.dispatchEvent(new Event('input')) when unsetting
      setTimeout(() => UpdateAllTableData.changeTableData(at, content, startRowIndex), 40);
    } else {
      UpdateAllTableData.changeTableData(at, content, startRowIndex);
    }
  }
}
