import {CellStructureUtils} from '../../../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {SelectCellTextElement} from './selectCellTextElement';
import {ArrowDownIconElement} from './arrowDownIconElement';
import {SelectCellEvents} from './selectCellEvents';

export class SelectCellElement {
  // prettier-ignore
  public static setCellSelectStructure(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    SelectCellTextElement.setCellTextAsAnElement(etc, cellElement, columnIndex);
    cellElement.appendChild(ArrowDownIconElement.get());
    SelectCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
  }

  public static setColumnSelectStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, SelectCellElement.setCellSelectStructure);
  }
}
