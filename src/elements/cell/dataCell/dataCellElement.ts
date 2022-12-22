import {CellStructureUtils} from '../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {DataCellEvents} from './dataCellEvents';
import {CellElement} from '../cellElement';

export class DataCellElement {
  // prettier-ignore
  private static setCellDataStructure(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    // overwrites all previous cell content
    cellElement.innerText = CellElement.getTextElement(cellElement).innerText; // CAUTION-1
    const {isCellTextEditable} = etc.columnsDetails[columnIndex].settings
    CellElement.prepContentEditable(cellElement, isCellTextEditable);
    DataCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
  }

  public static setColumnDataStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, DataCellElement.setCellDataStructure);
  }
}
