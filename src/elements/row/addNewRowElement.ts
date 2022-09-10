import {InsertNewDataRow} from '../../utils/insertRemoveStructure/insert/insertNewDataRow';
import {EditableTableComponent} from '../../editable-table-component';
import {CellElement} from '../cell/cellElement';
import {RowElement} from './rowElement';

export class AddNewRowElement {
  private static createCell() {
    const addNewRowCell = CellElement.create();
    addNewRowCell.classList.add('add-new-row-cell');
    addNewRowCell.textContent = '+ New';
    // WORK - this will need to increase by the number of columns
    addNewRowCell.colSpan = 4;
    return addNewRowCell;
  }

  private static createRow(etc: EditableTableComponent) {
    const addNewRowRow = RowElement.create();
    addNewRowRow.classList.add('add-new-row-row');
    addNewRowRow.onclick = InsertNewDataRow.insertEvent.bind(etc, 2);
    return addNewRowRow;
  }

  public static create(etc: EditableTableComponent) {
    const addNewRowRow = AddNewRowElement.createRow(etc);
    const addNewRowCell = AddNewRowElement.createCell();
    addNewRowRow.appendChild(addNewRowCell);
    return addNewRowRow;
  }
}
