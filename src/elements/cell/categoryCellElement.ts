import {EditableTableComponent} from '../../editable-table-component';
import {CategoryCellEvents} from './categoryCellEvents';
import {CellElement} from './cellElement';

export class CategoryCellElement extends CellElement {
  private static changeDataCellProperties(dataCell: HTMLElement) {
    dataCell.textContent = '';
    dataCell.contentEditable = 'false';
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
    dataCell.appendChild(textElement);
    CategoryCellElement.changeDataCellProperties(dataCell);
    CategoryCellEvents.addEvents(etc, dataCell, rowIndex, columnIndex);
  }
}
