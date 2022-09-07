import {EditableTableComponent} from '../../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../../enums/onUpdateCellType';
import {ElementDetails} from '../../../types/elementDetails';
import {RowElement} from '../../../elements/row/rowElement';
import {TableRow} from '../../../types/tableContents';
import {UpdateRows} from '../shared/updateRows';

export class InsertNewDataRow {
  private static updateRows(etc: EditableTableComponent, contentsRowIndex: number) {
    const lastRowElement = etc.dataElementRef?.children[etc.dataElementRef.children.length - 1];
    const lastRow: ElementDetails = {element: lastRowElement as HTMLElement, index: etc.contents.length - 1};
    UpdateRows.update(etc, contentsRowIndex, CELL_UPDATE_TYPE.ADD, lastRow);
    etc.onTableUpdate(etc.contents);
  }

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
      InsertNewDataRow.updateRows(this, contentsRowIndex);
    });
  }
}
