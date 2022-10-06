import {FirefoxCaretDisplayFix} from '../../utils/browser/firefox/firefoxCaretDisplayFix';
import {EditableTableComponent} from '../../editable-table-component';
import {CategoryCellEvents} from './categoryCellEvents';
import {Browser} from '../../utils/browser/browser';
import {CellElement} from './cellElement';
import {UniqueCategories} from '../../types/columnDetails';

export class CategoryCellElement {
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
    textElement.classList.add(CellElement.CATEGORY_CELL_TEXT_CLASS);
    textElement.style.backgroundColor = backgroundColor;
    CellElement.prepContentEditable(textElement, false);
    return textElement;
  }

  // prettier-ignore
  private static convertCellFromDataToCategory(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cell: HTMLElement, backgroundColor: string) {
    const textElement = CategoryCellElement.createTextElement(cell.textContent as string, backgroundColor);
    CategoryCellElement.setTextAsAnElement(cell, textElement);
    CategoryCellEvents.setEvents(etc, cell, rowIndex, columnIndex);
  }

  // prettier-ignore
  public static convertColumnFromDataToCategory(etc: EditableTableComponent,
      uniqueCategories: UniqueCategories, columnIndex: number) {
    const { elements } = etc.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataIndex: number) => {
      const relativeIndex = dataIndex + 1;
      CategoryCellElement.convertCellFromDataToCategory(etc, relativeIndex, columnIndex,
        cellElement, uniqueCategories[cellElement.textContent as string]);
    });
  }
}
