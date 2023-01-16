import {ConvertCellTypeUtils} from '../../../../utils/columnType/convertCellTypeUtils';
import {CellStructureUtils} from '../../../../utils/columnType/cellStructureUtils';
import {DateCellInputElement} from './dateCellInputElement';
import {DateCellTextElement} from './dateCellTextElement';
import {Browser} from '../../../../utils/browser/browser';
import {ActiveTable} from '../../../../activeTable';
import {DateCellEvents} from './dateCellEvents';

// a cell becomes a date when it uses a calendar
export class DateCellElement {
  // prettier-ignore
  public static setCellDateStructure(at: ActiveTable, cellElement: HTMLElement, columnIndex: number) {
    ConvertCellTypeUtils.preprocessCell(cellElement);
    cellElement.style.cursor = 'text';
    const {isCellTextEditable} = at.columnsDetails[columnIndex].settings;
    const textElement = DateCellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    if (Browser.IS_INPUT_DATE_SUPPORTED) DateCellInputElement.addDateInputElement(
      cellElement, textElement, at.columnsDetails[columnIndex].activeType);
  }

  public static setColumnDateStructure(at: ActiveTable, columnIndex: number) {
    CellStructureUtils.setColumn(at, columnIndex, DateCellElement.setCellDateStructure, DateCellEvents.setEvents);
  }
}
