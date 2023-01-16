import {ConvertCellTypeUtils} from '../../../../../utils/columnType/convertCellTypeUtils';
import {CellStructureUtils} from '../../../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {SelectCellTextElement} from './selectCellTextElement';
import {ArrowDownIconElement} from './arrowDownIconElement';
import {SelectCellEvents} from './selectCellEvents';
import {SelectCell} from '../selectCell';

export class SelectCellElement {
  public static setCellSelectStructure(etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number) {
    ConvertCellTypeUtils.preprocessCell(cellElement);
    SelectCellTextElement.setCellTextAsAnElement(etc, cellElement, columnIndex);
    cellElement.appendChild(ArrowDownIconElement.get());
    SelectCell.setPointerCursorIfCantAdd(cellElement, etc.columnsDetails[columnIndex].activeType);
  }

  public static setColumnSelectStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, SelectCellElement.setCellSelectStructure, SelectCellEvents.setEvents);
  }
}
