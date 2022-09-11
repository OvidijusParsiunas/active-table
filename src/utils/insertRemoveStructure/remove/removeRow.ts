import {EditableTableComponent} from '../../../editable-table-component';
import {FireCellUpdatesForRows} from '../shared/fireCellUpdatesForRows';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';

export class RemoveRow {
  private static removeRow(etc: EditableTableComponent, rowIndex: number) {
    etc.tableBodyElementRef?.removeChild(etc.tableBodyElementRef.children[rowIndex]);
    etc.contents.splice(rowIndex, 1);
  }

  public static remove(etc: EditableTableComponent, rowIndex: number) {
    const lastRowIndex = etc.contents.length - 1;
    const lastRowElement = etc.tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    RemoveRow.removeRow(etc, rowIndex);
    setTimeout(() => {
      const lastRow = {element: lastRowElement, index: lastRowIndex};
      FireCellUpdatesForRows.update(etc, rowIndex, CELL_UPDATE_TYPE.REMOVED, lastRow);
      etc.onTableUpdate(etc.contents);
    });
  }
}
