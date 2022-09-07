import {EditableTableComponent} from '../../../../dist/editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {UpdateRows} from '../shared/updateRows';

export class RemoveDataRow {
  private static removeRow(etc: EditableTableComponent, contentsRowIndex: number, dataRowIndex: number) {
    etc.dataElementRef?.removeChild(etc.dataElementRef.children[dataRowIndex]);
    etc.contents.splice(contentsRowIndex, 1);
  }

  public static remove(etc: EditableTableComponent, dataRowIndex: number) {
    if (etc.dataElementRef) {
      const contentsRowIndex = dataRowIndex + 1;
      const lastRowElement = etc.dataElementRef.children[etc.dataElementRef.children.length - 1] as HTMLElement;
      RemoveDataRow.removeRow(etc, contentsRowIndex, dataRowIndex);
      setTimeout(() => {
        const lastRow = {element: lastRowElement, index: etc.contents.length};
        UpdateRows.update(etc, contentsRowIndex, CELL_UPDATE_TYPE.REMOVED, lastRow);
        etc.onTableUpdate(etc.contents);
      });
    }
  }
}
