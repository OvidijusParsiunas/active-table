import {CategoryDropdownItem} from '../../../dropdown/categoryDropdown/categoryDropdownItem';
import {CellStructureUtils} from '../../../../utils/columnType/cellStructureUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {CellTextElement} from '../text/cellTextElement';
import {EMPTY_STRING} from '../../../../consts/text';
import {SelectCellEvents} from './selectCellEvents';
import {CellElement} from '../../cellElement';

// the logic for cell and text divs is handled here
export class LabelCellElement {
  private static readonly CATEGORY_TEXT_DIV_CLASS = 'category-text-div';

  public static isCategoryText(element: HTMLElement) {
    return element.classList.contains(LabelCellElement.CATEGORY_TEXT_DIV_CLASS);
  }

  private static setCellTextAsAnElement(cellElement: HTMLElement, backgroundColor: string, isCellTextEditable: boolean) {
    const textElement = CellTextElement.setCellTextAsAnElement(cellElement, isCellTextEditable);
    textElement.classList.add(LabelCellElement.CATEGORY_TEXT_DIV_CLASS);
    textElement.style.backgroundColor = backgroundColor;
  }

  // prettier-ignore
  public static setCellCategoryStructure(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    const {categoryDropdown: {categoryToItem}, settings: {isCellTextEditable}} = etc.columnsDetails[columnIndex];
    const backgroundColor = categoryToItem[CellElement.getText(cellElement)]?.color || '';
    LabelCellElement.setCellTextAsAnElement(cellElement, backgroundColor, isCellTextEditable as boolean);
    SelectCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
  }

  public static setColumnCategoryStructure(etc: EditableTableComponent, columnIndex: number) {
    CellStructureUtils.setColumn(etc, columnIndex, LabelCellElement.setCellCategoryStructure);
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
