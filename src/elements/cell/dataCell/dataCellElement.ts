import {EditableTableComponent} from '../../../editable-table-component';
import {DataCellEvents} from './dataCellEvents';
import {CellElement} from '../cellElement';

export class DataCellElement {
  // prettier-ignore
  private static convertCellFromCategoryToData(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cell: HTMLElement) {
    cell.innerText = (cell.children[0] as HTMLElement).innerText; // CAUTION-1
    CellElement.prepContentEditable(cell, false);
    DataCellEvents.setEvents(etc, cell, rowIndex, columnIndex);
  }

  public static convertColumnFromTextDivColumnToData(etc: EditableTableComponent, columnIndex: number) {
    const {elements} = etc.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataIndex: number) => {
      const relativeIndex = dataIndex + 1;
      DataCellElement.convertCellFromCategoryToData(etc, relativeIndex, columnIndex, cellElement);
    });
  }
}
