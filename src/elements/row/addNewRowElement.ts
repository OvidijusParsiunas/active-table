import {TableDimensionsUtils} from '../../utils/tableDimensions/tableDimensionsUtils';
import {InsertNewRow} from '../../utils/insertRemoveStructure/insert/insertNewRow';
import {MaximumRows} from '../../utils/insertRemoveStructure/insert/maximumRows';
import {EditableTableComponent} from '../../editable-table-component';
import {CellElement} from '../cell/cellElement';
import {CSSStyle} from '../../types/cssStyle';
import {RowElement} from './rowElement';

export class AddNewRowElement {
  private static readonly DEFAULT_COL_SPAN = 1_000_000_000;
  private static readonly HIDDEN = 'none';
  private static readonly VISIBLE = '';
  private static readonly DEFAULT_WIDTH = ''; // uses the table width

  private static toggleDisplay(addNewRowCell: HTMLElement, isDisplay: boolean) {
    addNewRowCell.style.display = isDisplay ? AddNewRowElement.VISIBLE : AddNewRowElement.HIDDEN;
  }

  private static toggleWidth(addNewRowCell: HTMLElement, setDefault: boolean, width?: number) {
    addNewRowCell.style.width = setDefault
      ? AddNewRowElement.DEFAULT_WIDTH
      : `${width || TableDimensionsUtils.MINIMAL_TABLE_WIDTH}px`;
  }

  private static createCell(cellStyle: CSSStyle, clientDisplayAddRowCell: boolean) {
    const addNewRowCell = CellElement.create(cellStyle, {});
    addNewRowCell.id = 'add-new-row-cell';
    addNewRowCell.textContent = '+ New';
    AddNewRowElement.toggleDisplay(addNewRowCell, clientDisplayAddRowCell);
    AddNewRowElement.toggleWidth(addNewRowCell, clientDisplayAddRowCell);
    // set to high number to always merge cells in this row
    addNewRowCell.colSpan = AddNewRowElement.DEFAULT_COL_SPAN;
    return addNewRowCell;
  }

  private static createRow(etc: EditableTableComponent) {
    const addNewRowRow = RowElement.create();
    addNewRowRow.id = 'add-new-row-row';
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

  // WORK - need to be able to delete first row when no header
  // not sure if the user should be able to remove the header row

  // TO-DO - no content rules:
  // when noHeader is true or noHeader is false but content is still []
  // when user sets add row button as displayed and column button as not - should display add row button
  // when user sets add row button as not displayed and column button as displayed - should display add column button
  // when user sets add row button as displayed and column as displayed - should display add column button
  // when user sets add row button as not displayed and column as not displayed - should display add column button
  // when header with no data content
  // when user sets add row button as displayed display it
  // when user sets add row button to as not displayed - do not display it
  // ESTABLISH remove row UX and add column button before proceeding any further with this
  public static toggle(etc: EditableTableComponent) {
    const {tableBodyElementRef, addRowCellElementRef, displayAddRowCell, columnsDetails, tableDimensionsInternal} = etc;
    if (!addRowCellElementRef || !tableBodyElementRef) return;
    const numberOfRows = columnsDetails[0]?.elements.length || 0;
    if (displayAddRowCell) {
      AddNewRowElement.toggleDisplay(addRowCellElementRef, MaximumRows.canAddMore(etc));
      AddNewRowElement.toggleWidth(addRowCellElementRef, numberOfRows > 0, tableDimensionsInternal.width);
    } else {
      // when displayAddRowCell is false, the width should always be default
      AddNewRowElement.toggleDisplay(addRowCellElementRef, numberOfRows === 0);
    }
  }
}
