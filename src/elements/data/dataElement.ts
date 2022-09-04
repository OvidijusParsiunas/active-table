import {EditableTableComponent} from '../../editable-table-component';
import {TableRow} from '../../types/tableContents';
import {RowElement} from '../row/rowElement';

export class DataElement {
  public static create(etc: EditableTableComponent) {
    const dataElement = document.createElement('div');
    dataElement.classList.add('data');
    etc.contents.slice(1).forEach((dataRow: TableRow, rowIndex: number) => {
      const rowElement = RowElement.create(etc, dataRow, rowIndex);
      dataElement.appendChild(rowElement);
    });
    return dataElement;
  }
}
