import {FirefoxCaretDisplayFix} from '../../../../utils/browser/firefox/firefoxCaretDisplayFix';
import {CategoryDropdownItem} from '../../../dropdown/categoryDropdown/categoryDropdownItem';
import {EditableTableComponent} from '../../../../editable-table-component';
import {TEXT_DIV_COLUMN_TYPE} from '../../../../enums/columnType';
import {Browser} from '../../../../utils/browser/browser';
import {CategoryCellEvents} from './categoryCellEvents';
import {CellElement} from '../../cellElement';

// the logic for cell and text divs is handled here
export class CategoryCellElement {
  private static setTextAsAnElement(cellElement: HTMLElement, textElement: HTMLElement) {
    cellElement.textContent = '';
    cellElement.contentEditable = 'false';
    // not really part of the bug, but in the same area
    if (Browser.IS_FIREFOX) FirefoxCaretDisplayFix.removeTabIndex(cellElement);
    cellElement.appendChild(textElement);
  }

  private static createTextElement(text: string, backgroundColor: string) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.classList.add(CellElement.CELL_TEXT_DIV_CLASS);
    textElement.style.backgroundColor = backgroundColor;
    CellElement.prepContentEditable(textElement, false);
    return textElement;
  }

  // prettier-ignore
  public static convertCellFromDataToCategory(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cell: HTMLElement, backgroundColor: string) {
    const textElement = CategoryCellElement.createTextElement(cell.textContent as string, backgroundColor);
    CategoryCellElement.setTextAsAnElement(cell, textElement);
    CategoryCellEvents.setEvents(etc, cell, rowIndex, columnIndex);
  }

  // prettier-ignore
  public static convertColumnToCategoryType(etc: EditableTableComponent, columnIndex: number, previousType: string) {
    const {elements, categoryDropdown: {categoryToItem}} = etc.columnsDetails[columnIndex];
    const shouldResetContents = Boolean(TEXT_DIV_COLUMN_TYPE[previousType]);
    elements.slice(1).forEach((cellElement: HTMLElement, dataIndex: number) => {
      // this is a very simple way to clear the previous content inside the cell and replace it with cell text
      // additionallity it may not be as efficient because this if statement will be called every time,
      // however no efficiency issues have been seen on the browser so far
      if (shouldResetContents) {
        const text = (cellElement.children[0] as HTMLElement).textContent as string;
        cellElement.textContent = text;
      }
      const relativeIndex = dataIndex + 1;
      CategoryCellElement.convertCellFromDataToCategory(etc, relativeIndex, columnIndex,
        cellElement, categoryToItem[cellElement.textContent as string]?.color || '');
    });
  }

  // prettier-ignore
  public static finaliseEditedText(etc: EditableTableComponent, textElement: HTMLElement, columnIndex: number,
      processMatching = false) {
    const {categoryDropdown} = etc.columnsDetails[columnIndex];
    const color = categoryDropdown.categoryToItem[textElement.textContent as string]?.color;
    if (textElement.textContent === '' || textElement.textContent === etc.defaultCellValue) {
      textElement.style.backgroundColor = '';
    } else if (processMatching && color) {
      textElement.style.backgroundColor = color;
    } else {
      // if a category is deleted and then added with an already existing text element, use its current background
      CategoryDropdownItem.addNewCategory(etc, textElement, categoryDropdown, textElement.style.backgroundColor);
    }
  }
}
