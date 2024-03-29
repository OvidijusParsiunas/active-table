import {CaretDisplayFix} from '../../../../utils/browser/caretDisplayFix';
import {CellElement} from '../../cellElement';

// REF-5
export class CellTextElement {
  // used for encapsulating text within a nested element
  // select label - used to color the text
  // date - used to display a calendar beside the text
  public static readonly CELL_TEXT_DIV_CLASS = 'cell-text-div';

  private static set(cellElement: HTMLElement, textElement: HTMLElement) {
    cellElement.innerText = ''; // removes all cell content
    cellElement.contentEditable = 'false';
    // not really part of the bug, but in the same area
    if (CaretDisplayFix.isIssueBrowser()) CaretDisplayFix.removeTabIndex(cellElement);
    cellElement.appendChild(textElement);
  }

  private static createTextElement(text: string, isCellTextEditable: boolean) {
    const textElement = document.createElement('div');
    textElement.innerText = text;
    // this fixes an issue where converting to a text element that has no text does not add a <br> which causes
    // an error to be thrown when clicking on the cell element
    if (text === '') CaretDisplayFix.addBRPaddingToEmptyCell(textElement, '');
    textElement.classList.add(CellTextElement.CELL_TEXT_DIV_CLASS);
    CellElement.prepContentEditable(textElement, isCellTextEditable);
    return textElement;
  }

  public static setCellTextAsAnElement(cellElement: HTMLElement, isCellTextEditable: boolean) {
    const text = CellElement.getText(cellElement);
    const textElement = CellTextElement.createTextElement(text, isCellTextEditable); // CAUTION-1
    CellTextElement.set(cellElement, textElement);
    return textElement;
  }
}
