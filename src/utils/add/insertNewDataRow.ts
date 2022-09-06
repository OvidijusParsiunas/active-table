import {UpdateStructures, LastRowDetails} from '../insertRemoveStructure/shared/updateStructures';
import {EditableTableComponent} from '../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';
import {RowElement} from '../../elements/row/rowElement';
import {TableRow} from '../../types/tableContents';

export class InsertNewDataRow {
  private static createNewRowData(etc: EditableTableComponent): TableRow {
    const numberOfColumns = etc.contents[0].length;
    return new Array(numberOfColumns).fill(etc.defaultValue);
  }

  private static insertNewRow(etc: EditableTableComponent, contentsRowIndex: number) {
    const newRowData = InsertNewDataRow.createNewRowData(etc);
    const newRowElement = RowElement.create(etc, newRowData, contentsRowIndex);
    etc.dataElementRef?.insertBefore(newRowElement, etc.dataElementRef.children[contentsRowIndex - 1]);
    etc.contents.splice(contentsRowIndex, 0, newRowData);
  }

  public static insert(this: EditableTableComponent, dataRowIndex: number) {
    const contentsRowIndex = dataRowIndex + 1;
    InsertNewDataRow.insertNewRow(this, contentsRowIndex);
    setTimeout(() => {
      if (!this.dataElementRef) return;
      const lastRowElement = this.dataElementRef?.children[this.dataElementRef.children.length - 1];
      const lastRow: LastRowDetails = {element: lastRowElement as HTMLElement, index: this.contents.length - 1};
      UpdateStructures.updateDataRows(this, contentsRowIndex, CELL_UPDATE_TYPE.ADD, lastRow);
      this.onTableUpdate(this.contents);
    });
  }
}
