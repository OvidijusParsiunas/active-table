import {EditableTableComponent} from '../../editable-table-component';
import {InsertNewDataRow} from '../../utils/add/insertNewDataRow';

export class AddNewRowElement {
  private static createCell() {
    const addNewRowCell = document.createElement('div');
    addNewRowCell.classList.add('add-new-row-cell', 'cell');
    addNewRowCell.textContent = '+ New';
    return addNewRowCell;
  }

  private static createRow(etc: EditableTableComponent) {
    const addNewRowRow = document.createElement('div');
    addNewRowRow.classList.add('add-new-row-row', 'row');
    addNewRowRow.onclick = InsertNewDataRow.insert.bind(etc, 0);
    return addNewRowRow;
  }

  public static create(etc: EditableTableComponent) {
    const addNewRowRow = AddNewRowElement.createRow(etc);
    const addNewRowCell = AddNewRowElement.createCell();
    addNewRowRow.appendChild(addNewRowCell);
    return addNewRowRow;
  }
}
