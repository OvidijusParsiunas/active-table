import {MaximumRows} from '../../../../utils/insertRemoveStructure/insert/maximumRows';
import {EditableTableComponent} from '../../../../editable-table-component';
import {NoContentStubElement} from '../shared/noContentStubElement';
import {CellElement} from '../../../cell/cellElement';
import {AddNewRowEvents} from './addNewRowEvents';
import {RowHoverEvents} from './rowHoverEvents';
import {RowElement} from './rowElement';

export class AddNewRowElement {
  private static readonly DEFAULT_COL_SPAN = 1_000_000_000;
  private static readonly HIDDEN = 'none';
  private static readonly VISIBLE = '';
  public static readonly ID = 'add-new-row-cell';

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
  private static createCell(etc: EditableTableComponent) {
    const {defaultColumnsSettings: {cellStyle}, auxiliaryTableContentInternal: {displayAddRowCell, styleProps}} = etc;
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
    AddNewRowEvents.setCellEvents(etc, addNewRowCell);
    return addNewRowCell;
  }

  public static create(etc: EditableTableComponent) {
    const addNewRowRow = RowElement.create();
    if (etc.rowHover?.style && etc.rowHover.hoverAddNewRowButton) RowHoverEvents.addEvents(etc.rowHover, addNewRowRow, 1);
    const addNewRowCell = AddNewRowElement.createCell(etc);
    addNewRowRow.appendChild(addNewRowCell);
    return addNewRowCell;
  }

  // prettier-ignore
  public static toggle(etc: EditableTableComponent) {
    const {tableBodyElementRef, addRowCellElementRef, auxiliaryTableContentInternal: {displayAddRowCell}} = etc;
    if (!addRowCellElementRef?.parentElement || !tableBodyElementRef) return;
    if (displayAddRowCell) AddNewRowElement.setDisplay(addRowCellElementRef, MaximumRows.canAddMore(etc));
    RowElement.toggleLastRowClass(etc.shadowRoot as ShadowRoot, addRowCellElementRef.parentElement)
  }
}
