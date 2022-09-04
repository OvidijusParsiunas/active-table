import {EditableTableComponent} from '../../editable-table-component';
import {RowElement} from '../../elements/row/rowElement';

export class AddNewRow {
  private static createRowCellData(etc: EditableTableComponent) {
    const numberOfColumns = etc.contents[0].length;
    const newRowData = new Array(numberOfColumns).fill(etc.defaultValue);
    etc.contents.push(newRowData);
    newRowData.forEach((cellText: string, columnIndex: number) => {
      etc.onCellUpdate(cellText, etc.contents.length - 1, columnIndex);
    });
    return newRowData;
  }

  public static add(this: EditableTableComponent) {
    const newRowData = AddNewRow.createRowCellData(this);
    this.onTableUpdate(this.contents);
    const newRowElement = RowElement.create(this, newRowData, this.contents.length - 2);
    this.dataElementRef?.appendChild(newRowElement);
  }
}
