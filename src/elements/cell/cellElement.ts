import {FirefoxCaretDisplayFix} from '../../utils/browser/firefox/firefoxCaretDisplayFix';
import {EditableTableComponent} from '../../editable-table-component';
import {HeaderCellEvents} from './headerCellEvents';
import {Browser} from '../../utils/browser/browser';
import {DataCellEvents} from './dataCellEvents';
import {CSSStyle} from '../../types/cssStyle';

export class CellElement {
  public static readonly DEFAULT_COLUMN_WIDTH = '100px';
  public static readonly CELL_CLASS = 'cell';
  protected static readonly CATEGORY_CELL_TEXT_CLASS = 'category-cell-text';

  // not the text element
  public static extractCellElement(element: HTMLElement) {
    if (element.classList.contains(CellElement.CATEGORY_CELL_TEXT_CLASS)) {
      return element.parentElement as HTMLElement;
    }
    return element;
  }

  public static getText(element: HTMLElement) {
    return (
      element.classList.contains(CellElement.CELL_CLASS) &&
      element.children[0]?.classList.contains(CellElement.CATEGORY_CELL_TEXT_CLASS)
        ? element.children[0].textContent
        : element.textContent
    ) as string;
  }

  // set text is optional as some functions may only need to augment the cell
  public static processAndSetTextOnCell(cellElement: HTMLElement, text: string, setText = true) {
    if (setText) cellElement.textContent = text;
    FirefoxCaretDisplayFix.addPaddingToEmptyCell(cellElement, text);
  }

  // prettier-ignore
  public static setCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (rowIndex === 0) {
      HeaderCellEvents.set(etc, cellElement, columnIndex);
    } else {
      DataCellEvents.set(etc, cellElement, rowIndex, columnIndex);
    }
  }

  public static create(cellStyle: CSSStyle, headerStyle: CSSStyle, isHeader = false) {
    const cellElement = document.createElement(isHeader ? 'th' : 'td');
    cellElement.classList.add(CellElement.CELL_CLASS);
    // role for assistive technologies
    cellElement.setAttribute('role', 'textbox');
    Object.assign(cellElement.style, cellStyle, isHeader ? headerStyle : {});
    return cellElement;
  }

  protected static prepContentEditable(cellElement: HTMLElement, isHeader: boolean) {
    if (Browser.IS_FIREFOX) {
      FirefoxCaretDisplayFix.setAttributes(cellElement, isHeader);
    } else {
      cellElement.contentEditable = String(!isHeader);
    }
  }

  private static createCellDOMElement(etc: EditableTableComponent, cellText: string, isHeader: boolean) {
    const cellElement = CellElement.create(etc.cellStyle, etc.headerStyle, isHeader);
    CellElement.processAndSetTextOnCell(cellElement, cellText);
    CellElement.prepContentEditable(cellElement, isHeader);
    if (isHeader) cellElement.style.width = CellElement.DEFAULT_COLUMN_WIDTH;
    return cellElement;
  }

  public static createCellElement(etc: EditableTableComponent, cellText: string, rowIndex: number, columnIndex: number) {
    const cellElement = CellElement.createCellDOMElement(etc, cellText, rowIndex === 0);
    CellElement.setCellEvents(etc, cellElement, rowIndex, columnIndex);
    return cellElement;
  }
}
