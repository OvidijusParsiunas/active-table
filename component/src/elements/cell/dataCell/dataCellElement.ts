import {CellStructureUtils} from '../../../utils/columnType/cellStructureUtils';
import {ActiveTable} from '../../../activeTable';
import {DataCellEvents} from './dataCellEvents';
import {CellElement} from '../cellElement';

export class DataCellElement {
  private static setCellDataStructure(at: ActiveTable, cellElement: HTMLElement, columnIndex: number) {
    // overwrites all previous cell content
    cellElement.innerText = CellElement.getTextElement(cellElement).innerText; // CAUTION-1
    const {isCellTextEditable} = at._columnsDetails[columnIndex].settings;
    CellElement.prepContentEditable(cellElement, isCellTextEditable);
  }

  public static setColumnDataStructure(at: ActiveTable, columnIndex: number) {
    CellStructureUtils.setColumn(at, columnIndex, DataCellElement.setCellDataStructure, DataCellEvents.setEvents);
  }
}
