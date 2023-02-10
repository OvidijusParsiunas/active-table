import {ConvertCellTypeUtils} from '../../../../../utils/columnType/convertCellTypeUtils';
import {CellStructureUtils} from '../../../../../utils/columnType/cellStructureUtils';
import {SelectCellTextElement} from './selectCellTextElement';
import {ArrowDownIconElement} from './arrowDownIconElement';
import {ActiveTable} from '../../../../../activeTable';
import {SelectCellEvents} from './selectCellEvents';
import {SelectCell} from '../selectCell';

export class SelectCellElement {
  public static setCellSelectStructure(at: ActiveTable, cellElement: HTMLElement, columnIndex: number) {
    ConvertCellTypeUtils.preprocessCell(cellElement);
    SelectCellTextElement.setCellTextAsAnElement(at, cellElement, columnIndex);
    cellElement.appendChild(ArrowDownIconElement.get());
    SelectCell.setPointerCursorIfCantAdd(cellElement, at._columnsDetails[columnIndex].activeType);
  }

  public static setColumnSelectStructure(at: ActiveTable, columnIndex: number) {
    CellStructureUtils.setColumn(at, columnIndex, SelectCellElement.setCellSelectStructure, SelectCellEvents.setEvents);
  }
}
