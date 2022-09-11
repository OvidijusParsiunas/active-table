import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {EditableTableComponent} from '../../editable-table-component';
import {CellElement} from '../cell/cellElement';
import {CSSStyle} from '../../types/cssStyle';
import {RowElement} from './rowElement';

export class AddNewRowElement {
  private static readonly DEFAULT_COL_SPAN = 1_000_000_000;

  private static createCell(customCellStyle: CSSStyle) {
    const addNewRowCell = CellElement.create(customCellStyle);
    addNewRowCell.classList.add('add-new-row-cell');
    addNewRowCell.textContent = '+ New';
    // set to high number to always merge cells in this row
    addNewRowCell.colSpan = AddNewRowElement.DEFAULT_COL_SPAN;
    return addNewRowCell;
  }

  private static createRow(etc: EditableTableComponent) {
    const addNewRowRow = RowElement.create();
    addNewRowRow.classList.add('add-new-row-row');
    addNewRowRow.onclick = InsertNewRow.insertEvent.bind(etc, 2);
    return addNewRowRow;
  }

  public static create(etc: EditableTableComponent) {
    const addNewRowRow = AddNewRowElement.createRow(etc);
    const addNewRowCell = AddNewRowElement.createCell(etc.customCellStyle);
    addNewRowRow.appendChild(addNewRowCell);
    return addNewRowRow;
  }
}
