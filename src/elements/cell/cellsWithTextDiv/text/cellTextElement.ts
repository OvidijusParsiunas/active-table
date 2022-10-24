import {FirefoxCaretDisplayFix} from '../../../../utils/browser/firefox/firefoxCaretDisplayFix';
import {Browser} from '../../../../utils/browser/browser';
import {CellElement} from '../../cellElement';

export class CellTextElement {
  // used for encapsulating text within a nested element
  // category - used to color the text
  // date - used to display a calendar beside the text
  public static readonly CELL_TEXT_DIV_CLASS = 'cell-text-div';

  private static set(cellElement: HTMLElement, textElement: HTMLElement) {
    cellElement.textContent = '';
    cellElement.contentEditable = 'false';
    // not really part of the bug, but in the same area
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.removeTabIndex(cellElement);
    cellElement.appendChild(textElement);
  }

  private static createTextElement(text: string) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.classList.add(CellTextElement.CELL_TEXT_DIV_CLASS);
    CellElement.prepContentEditable(textElement, false);
    return textElement;
  }

  public static setCellTextAsAnElement(cellElement: HTMLElement) {
    const textElement = CellTextElement.createTextElement(cellElement.textContent as string);
    CellTextElement.set(cellElement, textElement);
    return textElement;
  }
}
