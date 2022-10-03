import {FirefoxCaretDisplayFix} from '../../utils/browser/firefox/firefoxCaretDisplayFix';
import {EditableTableComponent} from '../../editable-table-component';
import {CategoryCellEvents} from './categoryCellEvents';
import {Browser} from '../../utils/browser/browser';
import {CellElement} from './cellElement';

export class CategoryCellElement extends CellElement {
  private static setTextAsAnElement(dataCell: HTMLElement, textElement: HTMLElement) {
    dataCell.textContent = '';
    dataCell.contentEditable = 'false';
    // not really part of the bug, but in the same area
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.removeTabIndex(dataCell);
    dataCell.appendChild(textElement);
  }

  private static createTextElement(text: string, backgroundColor: string) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.classList.add(CategoryCellElement.CATEGORY_CELL_TEXT_CLASS);
    textElement.style.backgroundColor = backgroundColor;
    CellElement.prepContentEditable(textElement, false);
    return textElement;
  }

  // prettier-ignore
  public static convertFromDataToCategory(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, dataCell: HTMLElement, backgroundColor: string) {
    const textElement = CategoryCellElement.createTextElement(dataCell.textContent as string, backgroundColor);
    CategoryCellElement.setTextAsAnElement(dataCell, textElement);
    CategoryCellEvents.addEvents(etc, dataCell, rowIndex, columnIndex);
  }
}
