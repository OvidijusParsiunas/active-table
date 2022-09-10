import {EditableTableComponent} from '../../../editable-table-component';
// import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
// WORK
// import {UpdateRows} from '../shared/updateRows';

export class RemoveDataRow {
  private static removeRow(etc: EditableTableComponent, rowIndex: number) {
    etc.tableBodyElementRef?.removeChild(etc.tableBodyElementRef.children[rowIndex]);
    etc.contents.splice(rowIndex, 1);
  }

  public static remove(etc: EditableTableComponent, rowIndex: number) {
    const lastRowIndex = etc.contents.length;
    const lastRowElement = etc.tableBodyElementRef?.children[lastRowIndex] as HTMLElement;
    RemoveDataRow.removeRow(etc, rowIndex);
    setTimeout(() => {
      const lastRow = {element: lastRowElement, index: lastRowIndex};
      // UpdateRows.update(etc, rowIndex, CELL_UPDATE_TYPE.REMOVED, lastRow);
      etc.onTableUpdate(etc.contents);
    });
  }
}
