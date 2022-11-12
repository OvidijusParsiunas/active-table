import {EditableTableComponent} from '../../../editable-table-component';
import {AddNewColumnEvents} from './addNewColumnEvents';
import {CellElement} from '../../cell/cellElement';

export class AddNewColumnElement {
  private static readonly ADD_COLUMN_CELL_CLASS = 'add-column-cell';
  public static readonly WIDTH = 20;
  private static readonly WIDTH_PX = `${AddNewColumnElement.WIDTH}px`;

  private static createCell(etc: EditableTableComponent, tag: 'th' | 'td') {
    const cell = document.createElement(tag);
    cell.classList.add(CellElement.CELL_CLASS, AddNewColumnElement.ADD_COLUMN_CELL_CLASS);
    Object.assign(cell.style, etc.cellStyle);
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
}
