import {CellStructureUtils} from '../../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {DateCellInputElement} from './dateCellInputElement';
import {DateCellTextElement} from './dateCellTextElement';
import {Browser} from '../../../../utils/browser/browser';
import {DateCellEvents} from './dateCellEvents';

// a cell becomes a date when calendar it uses a calendar
export class DateCellElement {
  // prettier-ignore
  public static setCellDateStructure(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const {isCellTextEditable} = etc.columnsDetails[columnIndex].settings
    const textElement = DateCellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    if (Browser.IS_INPUT_DATE_SUPPORTED) DateCellInputElement.addDateInputElement(
      cellElement, textElement, etc.columnsDetails[columnIndex].activeType);
    setTimeout(() => DateCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex));
  }

  public static setColumnDateStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, DateCellElement.setCellDateStructure.bind(etc));
  }
}
