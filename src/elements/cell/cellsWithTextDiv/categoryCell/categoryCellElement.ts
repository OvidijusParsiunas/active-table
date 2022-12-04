import {CategoryDropdownItem} from '../../../dropdown/categoryDropdown/categoryDropdownItem';
import {EditableTableComponent} from '../../../../editable-table-component';
import {CellWithTextElement} from '../cellWithTextElement';
import {CellTextElement} from '../text/cellTextElement';
import {CategoryCellEvents} from './categoryCellEvents';
import {EMPTY_STRING} from '../../../../consts/text';
import {CellElement} from '../../cellElement';

// the logic for cell and text divs is handled here
export class CategoryCellElement {
  private static readonly CATEGORY_TEXT_DIV_CLASS = 'category-text-div';

  private static setCellTextAsAnElement(cellElement: HTMLElement, backgroundColor: string) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement);
    textElement.classList.add(CategoryCellElement.CATEGORY_TEXT_DIV_CLASS);
    textElement.style.backgroundColor = backgroundColor;
  }

  // prettier-ignore
  public static convertCellFromDataToCategory(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const {categoryDropdown: {categoryToItem}} = etc.columnsDetails[columnIndex];
    const backgroundColor = categoryToItem[CellElement.getText(cellElement)]?.color || '';
    CategoryCellElement.setCellTextAsAnElement(cellElement, backgroundColor);
    CategoryCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
  }

  // prettier-ignore
  public static convertColumnTypeToCategory(etc: EditableTableComponent, columnIndex: number, previousType: string) {
    CellWithTextElement.convertColumnToTextType(
      etc, columnIndex, previousType, CategoryCellElement.convertCellFromDataToCategory);
  }

  // prettier-ignore
  public static finaliseEditedText(etc: EditableTableComponent, textElement: HTMLElement, columnIndex: number,
      processMatching = false) {
    const {categoryDropdown, settings: {defaultText, isDefaultTextRemovable}} = etc.columnsDetails[columnIndex];
    const color = categoryDropdown.categoryToItem[CellElement.getText(textElement)]?.color;
    if (CellElement.getText(textElement) === EMPTY_STRING
        || (isDefaultTextRemovable && CellElement.getText(textElement) === defaultText)) {
      textElement.style.backgroundColor = '';
    } else if (processMatching && color) {
      textElement.style.backgroundColor = color;
    } else {
      // if a category is deleted and then added with an already existing text element, use its current background
      CategoryDropdownItem.addNewCategory(etc, textElement, categoryDropdown, textElement.style.backgroundColor);
    }
  }
}
