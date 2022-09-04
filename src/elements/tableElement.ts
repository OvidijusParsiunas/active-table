import {EditableTableComponent} from '../editable-table-component';
import {AddNewRowElement} from './row/addNewRowElement';
import {HeaderElement} from './header/headerElement';
import {DataElement} from './data/dataElement';

export class TableElement {
  public static populate(etc: EditableTableComponent) {
    const headerElement = HeaderElement.create(etc);
    etc.dataElementRef = DataElement.create(etc);
    const addRowElement = AddNewRowElement.create(etc);
    etc.tableElementRef?.replaceChildren(headerElement, etc.dataElementRef, addRowElement);
  }

  public static create(etc: EditableTableComponent) {
    const tableElement = document.createElement('div');
    tableElement.classList.add('table');
    etc.tableElementRef = tableElement;
    etc.shadowRoot?.appendChild(tableElement);
    etc.onTableUpdate(etc.contents);
  }
}
