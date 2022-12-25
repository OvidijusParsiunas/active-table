import {CellStructureUtils} from '../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {CheckboxCellEvents} from './checkboxCellEvents';
import {CheckboxElement} from './checkboxElement';

export class CheckboxCellElement {
  public static readonly CHECKBOX_CELL_CLASS = 'checkbox-cell';

  private static setCellTextAsAnElement(cellElement: HTMLElement, isCellTextEditable: boolean) {
    CheckboxElement.setCellTextAsCheckbox(cellElement, isCellTextEditable);
    cellElement.contentEditable = 'false';
    cellElement.style.cursor = isCellTextEditable ? 'pointer' : 'default';
    cellElement.classList.add(CheckboxCellElement.CHECKBOX_CELL_CLASS);
  }

  // prettier-ignore
  public static setCellCheckboxStructure(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {settings: {isCellTextEditable}} = etc.columnsDetails[columnIndex];
    CheckboxCellElement.setCellTextAsAnElement(cellElement, isCellTextEditable as boolean);
    CheckboxCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
  }

  public static setColumnCheckboxStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, CheckboxCellElement.setCellCheckboxStructure);
  }
}
