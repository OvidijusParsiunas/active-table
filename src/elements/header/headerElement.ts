import {InsertNewDataRow} from '../../utils/insertRemoveStructure/insert/insertNewDataRow';
import {EditableTableComponent} from '../../editable-table-component';

export class HeaderElement {
  public static create(etc: EditableTableComponent) {
    const headerElement = document.createElement('div');
    headerElement.classList.add('header');
    etc.headerElementRef = headerElement;
    InsertNewDataRow.insert(etc, 0, etc.contents[0]);
    return headerElement;
  }
}
