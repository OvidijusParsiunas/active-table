import {InsertNewRow} from '../../../../utils/insertRemoveStructure/insert/insertNewRow';
import {MaximumRows} from '../../../../utils/insertRemoveStructure/insert/maximumRows';
import {EditableTableComponent} from '../../../../editable-table-component';
import {NoContentStubElement} from '../shared/noContentStubElement';
import {CellElement} from '../../../cell/cellElement';
import {CSSStyle} from '../../../../types/cssStyle';
import {RowElement} from './rowElement';

export class AddNewRowElement {
  private static readonly DEFAULT_COL_SPAN = 1_000_000_000;
  private static readonly HIDDEN = 'none';
  private static readonly VISIBLE = '';

  private static isDisplayed(addNewRowCell: HTMLElement) {
    return addNewRowCell.style.display === AddNewRowElement.VISIBLE;
  }

  public static setDisplay(addNewRowCell: HTMLElement, isDisplay: boolean) {
    if (AddNewRowElement.isDisplayed(addNewRowCell) !== isDisplay) {
      addNewRowCell.style.display = isDisplay ? AddNewRowElement.VISIBLE : AddNewRowElement.HIDDEN;
    }
  }

  public static setDefaultStyle(addNewRowCell: HTMLElement) {
    addNewRowCell.textContent = '+ New';
    addNewRowCell.style.width = '';
  }

  private static createCell(cellStyle: CSSStyle, displayAddRowCell: boolean) {
    const addNewRowCell = CellElement.create(cellStyle, {});
    addNewRowCell.id = 'add-new-row-cell';
    if (!displayAddRowCell) {
      // if this is not displayed when there is content, always use the stub style - REF-18
      NoContentStubElement.convertToStub(addNewRowCell);
      addNewRowCell.addEventListener('click', AddNewRowElement.setDisplay.bind(this, addNewRowCell, false));
    } else {
      AddNewRowElement.setDefaultStyle(addNewRowCell);
    }
    AddNewRowElement.setDisplay(addNewRowCell, displayAddRowCell);
    // set to high number to always merge cells in this row
    addNewRowCell.colSpan = AddNewRowElement.DEFAULT_COL_SPAN;
    return addNewRowCell;
  }

  private static createRow(etc: EditableTableComponent) {
    const addNewRowRow = RowElement.create();
    addNewRowRow.classList.add(CellElement.HOVERABLE_CELL_CLASS);
    addNewRowRow.onclick = InsertNewRow.insertEvent.bind(etc);
    return addNewRowRow;
  }

  public static create(etc: EditableTableComponent) {
    const addNewRowRow = AddNewRowElement.createRow(etc);
    const addNewRowCell = AddNewRowElement.createCell(etc.cellStyle, etc.displayAddRowCell);
    etc.addRowCellElementRef = addNewRowCell;
    addNewRowRow.appendChild(addNewRowCell);
    return addNewRowRow;
  }

  public static toggle(etc: EditableTableComponent) {
    const {tableBodyElementRef, addRowCellElementRef, displayAddRowCell} = etc;
    if (!displayAddRowCell || !addRowCellElementRef || !tableBodyElementRef) return;
    AddNewRowElement.setDisplay(addRowCellElementRef, MaximumRows.canAddMore(etc));
  }
}
