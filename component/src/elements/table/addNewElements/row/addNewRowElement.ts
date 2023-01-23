import {MaximumRows} from '../../../../utils/insertRemoveStructure/insert/maximum/maximumRows';
import {NoContentStubElement} from '../shared/noContentStubElement';
import {CellElement} from '../../../cell/cellElement';
import {ActiveTable} from '../../../../activeTable';
import {AddNewRowEvents} from './addNewRowEvents';
import {RowElement} from './rowElement';

export class AddNewRowElement {
  private static readonly DEFAULT_COL_SPAN = 1_000_000_000;
  private static readonly HIDDEN = 'none';
  private static readonly VISIBLE = '';
  private static readonly ID = 'add-new-row-cell';

  public static isDisplayed(addNewRowCell: HTMLElement) {
    return addNewRowCell.style.display === AddNewRowElement.VISIBLE;
  }

  public static setDisplay(addNewRowCell: HTMLElement, isDisplay: boolean) {
    if (AddNewRowElement.isDisplayed(addNewRowCell) !== isDisplay) {
      addNewRowCell.style.display = isDisplay ? AddNewRowElement.VISIBLE : AddNewRowElement.HIDDEN;
    }
  }

  public static setDefaultStyle(addNewRowCell: HTMLElement) {
    addNewRowCell.innerText = '+ New';
    addNewRowCell.style.width = '';
  }

  // prettier-ignore
  private static createCell(at: ActiveTable) {
    const {columnsSettings: {cellStyle}, auxiliaryTableContentInternal: {displayAddRowCell, styleProps}} = at;
    const addNewRowCell = CellElement.createContentCell(false, cellStyle, styleProps?.default);
    addNewRowCell.id = AddNewRowElement.ID;
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
    AddNewRowEvents.setCellEvents(at, addNewRowCell);
    return addNewRowCell;
  }

  public static create(at: ActiveTable) {
    const addNewRowRow = RowElement.create();
    const addNewRowCell = AddNewRowElement.createCell(at);
    addNewRowRow.appendChild(addNewRowCell);
    return addNewRowCell;
  }

  // prettier-ignore
  public static toggle(at: ActiveTable) {
    const {tableBodyElementRef, addRowCellElementRef, auxiliaryTableContentInternal: {displayAddRowCell}} = at;
    if (!addRowCellElementRef?.parentElement || !tableBodyElementRef) return;
    if (displayAddRowCell) AddNewRowElement.setDisplay(addRowCellElementRef, MaximumRows.canAddMore(at));
    RowElement.toggleLastRowClass(at.shadowRoot as ShadowRoot, addRowCellElementRef.parentElement)
  }

  public static isAddNewRowRow(rowElement: HTMLElement) {
    return rowElement.children[0]?.id === AddNewRowElement.ID;
  }
}
