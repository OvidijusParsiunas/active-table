import {FirefoxCaretDisplayFix} from '../../utils/browser/firefox/firefoxCaretDisplayFix';
import {EditableTableComponent} from '../../editable-table-component';
import {HeaderCellEvents} from './headerCellEvents';
import {Browser} from '../../utils/browser/browser';
import {DataCellEvents} from './dataCellEvents';
import {CSSStyle} from '../../types/cssStyle';

export class CellElement {
  public static readonly DEFAULT_COLUMN_WIDTH = '100px';
  public static readonly CELL_CLASS = 'cell';
  // used for encapsulating text within a nested element
  // category - used to color the text
  // date - used to display a calendar beside the text
  public static readonly CELL_TEXT_DIV_CLASS = 'cell-text-div';

  // this is used for case where element could be the cell element or the text inside a category cell
  // hence we need the actual cell  element here
  public static extractCellElement(element: HTMLElement) {
    // if category cell text
    if (element.classList.contains(CellElement.CELL_TEXT_DIV_CLASS)) {
      return element.parentElement as HTMLElement;
    }
    // if category cell or data cell
    return element;
  }

  // this is used for case where element could be the category cell element that contains a text element or
  // that text element or a standard data element, hence we need to set it
  private static setText(element: HTMLElement, text: string) {
    // if category cell
    if (element.children[0]?.classList.contains(CellElement.CELL_TEXT_DIV_CLASS)) {
      element.children[0].textContent = text;
    } else {
      element.textContent = text;
    }
  }

  // set text is optional as some functions may only need to augment the cell
  // prettier-ignore
  public static processAndSetTextOnCell(etc: EditableTableComponent, textContainerElement: HTMLElement, text: string,
      isUndo: boolean, setText = true) {
    if (setText) CellElement.setText(textContainerElement, text);
    // called in all browsers for consistency
    FirefoxCaretDisplayFix.toggleCellTextBRPadding(etc, textContainerElement, isUndo);
  }

  // prettier-ignore
  public static setCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (rowIndex === 0) {
      HeaderCellEvents.setEvents(etc, cellElement, columnIndex);
    } else {
      DataCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex);
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

  public static prepContentEditable(cellElement: HTMLElement, isHeader: boolean) {
    if (Browser.IS_FIREFOX) {
      FirefoxCaretDisplayFix.setTabIndex(cellElement, isHeader);
      FirefoxCaretDisplayFix.removeContentEditable(cellElement);
    } else {
      cellElement.contentEditable = String(!isHeader);
    }
  }

  private static createCellDOMElement(etc: EditableTableComponent, cellText: string, isHeader: boolean) {
    const cellElement = CellElement.create(etc.cellStyle, etc.headerStyle, isHeader);
    CellElement.processAndSetTextOnCell(etc, cellElement, cellText, false);
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
