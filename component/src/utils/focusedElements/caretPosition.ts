import {CheckboxCellElement} from '../../elements/cell/checkboxCell/checkboxCellElement';
import {CellElement} from '../../elements/cell/cellElement';
import {ActiveTable} from '../../activeTable';
import {Browser} from '../browser/browser';

export class CaretPosition {
  private static setSelectionToEndOfText(textContainerElement: HTMLElement, selection: Selection) {
    const textElement = CellElement.getTextElement(textContainerElement);
    const range = document.createRange();
    range.setStart(textElement.childNodes[0], CellElement.getText(textElement).length || 0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private static getSelection(at: ActiveTable): Selection | null {
    const shadowRoot = at.shadowRoot as unknown as Document;
    // chrome
    if (shadowRoot.getSelection) {
      return shadowRoot.getSelection();
    }
    // firefox
    // safari - uses the following but can't pick up the current location
    const windowShadowRoot = window.document.activeElement?.shadowRoot as unknown as Document;
    if (windowShadowRoot === shadowRoot) {
      return window.document.getSelection();
    }
    return null;
  }

  public static setToEndOfText(at: ActiveTable, textContainerElement: HTMLElement) {
    if (CheckboxCellElement.isCheckboxCell(textContainerElement)) return;
    let selection = CaretPosition.getSelection(at);
    if (Browser.IS_SAFARI && !selection) {
      textContainerElement.focus();
      selection = CaretPosition.getSelection(at);
    }
    if (selection) CaretPosition.setSelectionToEndOfText(textContainerElement, selection);
  }
}
