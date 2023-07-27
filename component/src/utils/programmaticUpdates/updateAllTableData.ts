import {NoContentStubElement} from '../../elements/table/addNewElements/shared/noContentStubElement';
import {FilterInternalUtils} from '../outerTableComponents/filter/rows/filterInternalUtils';
import {RemoveRow} from '../insertRemoveStructure/remove/removeRow';
import {TableContent} from '../../types/tableContent';
import {ActiveTable} from '../../activeTable';
import {InsertMatrix} from './insertMatrix';

export class UpdateAllTableData {
  private static changeTableData(at: ActiveTable, csvContent: TableContent, startRowIndex: number) {
    for (let i = at.content.length - 1; i >= startRowIndex; i -= 1) {
      RemoveRow.remove(at, i);
    }
    // in a timeout because RemoveRow.remove contains processes inside timeouts e.g. remove column details
    setTimeout(() => {
      InsertMatrix.insert(at, csvContent, startRowIndex, 0, true);
      if (startRowIndex === 0) {
        NoContentStubElement.convertFromStub({target: at._addRowCellElementRef as HTMLElement});
      }
    });
    // in a timeout as at.shadowRoot.contains does not work immediately
    setTimeout(() => FilterInternalUtils.completeReset(at), 6);
  }

  public static update(at: ActiveTable, csvContent: TableContent, startRowIndex: number) {
    let waitForFilterReset = false;
    if (at._visiblityInternal.rows) {
      waitForFilterReset = FilterInternalUtils.unsetAllFilters(at);
    }
    if (waitForFilterReset) {
      // need to wait for inputElement.dispatchEvent(new Event('input')) when unsetting
      setTimeout(() => UpdateAllTableData.changeTableData(at, csvContent, startRowIndex), 40);
    } else {
      UpdateAllTableData.changeTableData(at, csvContent, startRowIndex);
    }
  }
}
