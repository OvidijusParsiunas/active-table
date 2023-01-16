import {ConvertCellTypeUtils} from '../../../utils/columnType/convertCellTypeUtils';
import {CellStructureUtils} from '../../../utils/columnType/cellStructureUtils';
import {CheckboxCellEvents} from './checkboxCellEvents';
import {CellText} from '../../../types/tableContent';
import {CheckboxElement} from './checkboxElement';
import {ActiveTable} from '../../../activeTable';
import {CellElement} from '../cellElement';
import {CellEvents} from '../cellEvents';

export class CheckboxCellElement {
  private static isCheckbox(element?: HTMLElement) {
    return (element as HTMLInputElement)?.type === 'checkbox';
  }

  public static isCheckboxCell(cellElement: HTMLElement) {
    return CheckboxCellElement.isCheckbox(cellElement.children[0] as HTMLElement);
  }

  public static getCheckboxElement(element: HTMLElement) {
    if (CheckboxCellElement.isCheckboxCell(element)) {
      return element.children[0] as HTMLInputElement;
    }
    if (CheckboxCellElement.isCheckbox(element)) {
      return element as HTMLInputElement;
    }
    return undefined;
  }

  public static getValue(element: HTMLElement) {
    const checkbox = CheckboxCellElement.getCheckboxElement(element);
    if (checkbox) return String(checkbox.checked);
    return undefined;
  }

  public static setValue(element: HTMLElement, text: CellText) {
    const checkbox = CheckboxCellElement.getCheckboxElement(element);
    if (checkbox) {
      checkbox.checked = 'true' === text;
      return true;
    }
    return false;
  }

  // prettier-ignore
  private static setCellTextAsAnElement(at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {settings: {isCellTextEditable}} = at.columnsDetails[columnIndex];
    const text = CellElement.getText(cellElement);
    CheckboxElement.setCellTextAsCheckbox(cellElement, isCellTextEditable);
    cellElement.contentEditable = 'false';
    cellElement.style.cursor = isCellTextEditable ? 'pointer' : 'default';
    CellEvents.updateCell(at, text, rowIndex, columnIndex, {element: cellElement});
  }

  // prettier-ignore
  public static setCellCheckboxStructure(at: ActiveTable,
      cellElement: HTMLElement, columnIndex: number, rowIndex: number) {
    ConvertCellTypeUtils.preprocessCell(cellElement);
    CheckboxCellElement.setCellTextAsAnElement(at, cellElement, rowIndex, columnIndex);
  }

  // prettier-ignore
  public static setColumnCheckboxStructure(at: ActiveTable, columnIndex: number) {
    CellStructureUtils.setColumn(at, columnIndex, CheckboxCellElement.setCellCheckboxStructure,
      CheckboxCellEvents.setEvents);
  }
}
