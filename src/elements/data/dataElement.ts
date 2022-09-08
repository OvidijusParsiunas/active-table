import {InsertNewDataRow} from '../../utils/insertRemoveStructure/insert/insertNewDataRow';
import {EditableTableComponent} from '../../editable-table-component';
import {TableRow} from '../../types/tableContents';

export class DataElement {
  public static create(etc: EditableTableComponent) {
    const dataElement = document.createElement('div');
    dataElement.classList.add('data');
    etc.dataElementRef = dataElement;
    etc.contents.slice(1).forEach((dataRow: TableRow, rowIndex: number) => {
      InsertNewDataRow.insert(etc, rowIndex + 1, dataRow);
    });
  }
}
