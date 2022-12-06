import {CellStructureUtils} from '../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {DataCellEvents} from './dataCellEvents';
import {CellElement} from '../cellElement';

export class DataCellElement {
  // prettier-ignore
  private static setCellDataStructure(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cell: HTMLElement) {
    // overwrites all previous cell content
    cell.innerText = CellElement.getTextElement(cell).innerText; // CAUTION-1
    CellElement.prepContentEditable(cell, false);
    DataCellEvents.setEvents(etc, cell, rowIndex, columnIndex);
  }

  public static setColumnDataStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, DataCellElement.setCellDataStructure);
  }
}
