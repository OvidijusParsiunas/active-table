import {StaticTableWidthUtils} from '../../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {MaximumColumns} from '../../../utils/insertRemoveStructure/insert/maximumColumns';
import {EditableTableComponent} from '../../../editable-table-component';
import {AddNewColumnEvents} from './addNewColumnEvents';
import {CellElement} from '../../cell/cellElement';
import {TableElement} from '../tableElement';

export class AddNewColumnElement {
  public static readonly ADD_COLUMN_CELL_CLASS = 'add-column-cell';
  public static readonly WIDTH = 20;
  private static readonly WIDTH_PX = `${AddNewColumnElement.WIDTH}px`;
  private static readonly HIDDEN = 'none';
  private static readonly VISIBLE = '';

  public static isDisplayed(addColumnCellsElementsRef: HTMLElement[]) {
    return addColumnCellsElementsRef[0].style.display === AddNewColumnElement.VISIBLE;
  }

  private static toggleDisplay(cell: HTMLElement, isDisplay: boolean) {
    cell.style.display = isDisplay ? AddNewColumnElement.VISIBLE : AddNewColumnElement.HIDDEN;
  }

  private static createCell(etc: EditableTableComponent, tag: 'th' | 'td') {
    const cell = document.createElement(tag);
    cell.classList.add(CellElement.CELL_CLASS, AddNewColumnElement.ADD_COLUMN_CELL_CLASS);
    Object.assign(cell.style, etc.cellStyle);
    cell.style.display = etc.displayAddColumnCell ? AddNewColumnElement.VISIBLE : AddNewColumnElement.HIDDEN;
    AddNewColumnEvents.setEvents(etc, cell);
    return cell;
  }

  private static createHeaderCell(etc: EditableTableComponent) {
    const headerCell = AddNewColumnElement.createCell(etc, 'th');
    headerCell.style.width = AddNewColumnElement.WIDTH_PX;
    headerCell.textContent = '+';
    Object.assign(headerCell.style, etc.headerStyle);
    return headerCell;
  }

  private static createDataCell(etc: EditableTableComponent) {
    return AddNewColumnElement.createCell(etc, 'td');
  }

  public static appendToRow(etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number) {
    const cell = rowIndex === 0 ? AddNewColumnElement.createHeaderCell(etc) : AddNewColumnElement.createDataCell(etc);
    etc.addColumnCellsElementsRef.splice(rowIndex, 0, cell);
    rowElement.appendChild(cell);
  }

  public static toggle(etc: EditableTableComponent, isInsert: boolean) {
    const {addColumnCellsElementsRef} = etc;
    if (!addColumnCellsElementsRef || addColumnCellsElementsRef.length === 0) return;
    const canAddMore = MaximumColumns.canAddMore(etc);
    // do not toggle if already in the intended state
    if (canAddMore === AddNewColumnElement.isDisplayed(addColumnCellsElementsRef)) return;
    addColumnCellsElementsRef.forEach((cell) => AddNewColumnElement.toggleDisplay(cell, canAddMore));
    TableElement.changeAuxiliaryTableContentWidth(canAddMore ? AddNewColumnElement.WIDTH : -AddNewColumnElement.WIDTH);
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, isInsert);
  }
}
