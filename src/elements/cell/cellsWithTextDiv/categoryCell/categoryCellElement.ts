import {CategoryDropdownItem} from '../../../dropdown/categoryDropdown/categoryDropdownItem';
import {CellStructureUtils} from '../../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {CellTextElement} from '../text/cellTextElement';
import {CategoryCellEvents} from './categoryCellEvents';
import {EMPTY_STRING} from '../../../../consts/text';
import {CellElement} from '../../cellElement';

// TO-DO potentially rename category to badge
// the logic for cell and text divs is handled here
export class CategoryCellElement {
  private static readonly CATEGORY_TEXT_DIV_CLASS = 'category-text-div';

  private static setCellTextAsAnElement(cellElement: HTMLElement, backgroundColor: string, isCellTextEditable: boolean) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.classList.add(CategoryCellElement.CATEGORY_TEXT_DIV_CLASS);
    textElement.style.backgroundColor = backgroundColor;
  }

  // prettier-ignore
  public static setCellCategoryStructure(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {categoryDropdown: {categoryToItem}, settings: {isCellTextEditable}} = etc.columnsDetails[columnIndex];
    const backgroundColor = categoryToItem[CellElement.getText(cellElement)]?.color || '';
    CategoryCellElement.setCellTextAsAnElement(cellElement, backgroundColor, isCellTextEditable as boolean);
    CategoryCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
  }

  public static setColumnCategoryStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, CategoryCellElement.setCellCategoryStructure);
  }

  // prettier-ignore
  public static finaliseEditedText(etc: EditableTableComponent, textElement: HTMLElement, columnIndex: number,
      processMatching = false) {
    const {categoryDropdown,
      activeType: {categories}, settings: {defaultText, isDefaultTextRemovable}} = etc.columnsDetails[columnIndex];
    const color = categoryDropdown.categoryToItem[CellElement.getText(textElement)]?.color;
    if (CellElement.getText(textElement) === EMPTY_STRING
        || (isDefaultTextRemovable && CellElement.getText(textElement) === defaultText)) {
      textElement.style.backgroundColor = '';
    } else if (processMatching && color) {
      textElement.style.backgroundColor = color;
       // not using staticItems state as this method may be called before it is available, if not, then refactor
    } else if (!categories?.options) {
      // if a category is deleted and then added with an already existing text element, use its current background
      CategoryDropdownItem.addNewCategory(etc, textElement, categoryDropdown, textElement.style.backgroundColor);
    }
  }
}
