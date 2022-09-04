import {EditableTableComponent} from '../../editable-table-component';
import {RowElement} from '../row/rowElement';

export class HeaderElement {
  public static create(etc: EditableTableComponent) {
    const headerElement = document.createElement('div');
    headerElement.classList.add('header');
    const rowElement = RowElement.create(etc, etc.contents[0], 0, true);
    headerElement.appendChild(rowElement);
    return headerElement;
  }
}
