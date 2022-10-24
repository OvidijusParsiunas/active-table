import {FirefoxCaretDisplayFix} from '../../../../utils/browser/firefox/firefoxCaretDisplayFix';
import {CellWithTextElement} from '../cellWithTextElement';
import {Browser} from '../../../../utils/browser/browser';
import {CellElement} from '../../cellElement';

export class DateCellTextElement {
  public static setTextAsAnElement(cellElement: HTMLElement, textElement: HTMLElement) {
    cellElement.textContent = '';
    cellElement.contentEditable = 'false';
    // not really part of the bug, but in the same area
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.removeTabIndex(cellElement);
    cellElement.appendChild(textElement);
  }

  public static createTextElement(text: string) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.float = 'left';
    textElement.classList.add(CellWithTextElement.CELL_TEXT_DIV_CLASS);
    CellElement.prepContentEditable(textElement, false);
    return textElement;
  }
}
