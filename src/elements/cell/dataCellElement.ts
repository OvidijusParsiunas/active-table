import {EditableTableComponent} from '../../editable-table-component';
import {DataCellEvents} from './dataCellEvents';
import {CellElement} from './cellElement';

export class DataCellElement {
  // prettier-ignore
  private static convertCellFromCategoryToData(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cell: HTMLElement) {
    cell.textContent = cell.children[0].textContent;
    cell.style.backgroundColor = '';
    CellElement.prepContentEditable(cell, false);
    DataCellEvents.setEvents(etc, cell, rowIndex, columnIndex);
  }

  // prettier-ignore
  public static convertColumnFromCategoryToData(etc: EditableTableComponent,
      columnIndex: number) {
    const { elements } = etc.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataIndex: number) => {
      const relativeIndex = dataIndex + 1;
      DataCellElement.convertCellFromCategoryToData(etc, relativeIndex, columnIndex, cellElement);
    });
  }
}
