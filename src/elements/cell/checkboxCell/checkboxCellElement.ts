import {ConvertCellTypeUtils} from '../../../utils/columnType/convertCellTypeUtils';
import {CellStructureUtils} from '../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {CheckboxCellEvents} from './checkboxCellEvents';
import {CellText} from '../../../types/tableContents';
import {CheckboxElement} from './checkboxElement';
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
  private static setCellTextAsAnElement(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {settings: {isCellTextEditable}} = etc.columnsDetails[columnIndex];
    const text = CellElement.getText(cellElement);
    CheckboxElement.setCellTextAsCheckbox(cellElement, isCellTextEditable);
    cellElement.contentEditable = 'false';
    cellElement.style.cursor = isCellTextEditable ? 'pointer' : 'default';
    CellEvents.updateCell(etc, text, rowIndex, columnIndex, {element: cellElement});
  }

  // prettier-ignore
  public static setCellCheckboxStructure(etc: EditableTableComponent,
      cellElement: HTMLElement, columnIndex: number, rowIndex: number) {
    ConvertCellTypeUtils.preprocessCell(cellElement);
    CheckboxCellElement.setCellTextAsAnElement(etc, cellElement, rowIndex, columnIndex);
  }

  // prettier-ignore
  public static setColumnCheckboxStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, CheckboxCellElement.setCellCheckboxStructure,
      CheckboxCellEvents.setEvents);
  }

  public static defaultChangeTextFunc(text: CellText) {
    const processedString = String(text).trim().toLocaleLowerCase();
    if (processedString === '' || processedString === '0' || processedString === '00' || processedString === 'false') {
      return 'false';
    }
    return 'true';
  }
}
