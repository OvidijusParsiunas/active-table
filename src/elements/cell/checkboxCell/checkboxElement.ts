import {CellText} from '../../../types/tableContents';
import {CellElement} from '../cellElement';

export class CheckboxElement {
  private static createCheckbox(isCellTextEditable: boolean) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.pointerEvents = isCellTextEditable ? '' : 'none';
    return checkbox;
  }

  private static parseBooleanFromText(text: CellText) {
    const processedString = String(text).trim().toLocaleLowerCase();
    if (processedString === '' || processedString === '0' || processedString === '00' || processedString === 'false') {
      return false;
    }
    return true;
  }

  public static setCellTextAsCheckbox(cellElement: HTMLElement, isCellTextEditable: boolean) {
    const checkbox = CheckboxElement.createCheckbox(isCellTextEditable);
    const text = CellElement.getText(cellElement);
    checkbox.checked = CheckboxElement.parseBooleanFromText(text);
    cellElement.replaceChildren(checkbox);
  }
}
