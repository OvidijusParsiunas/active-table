import {EditableTableComponent} from '../../editable-table-component';
import {CSSStyle} from '../../types/cssStyle';
import {CellEvents} from './cellEvents';

export class CellElement {
  public static readonly DEFAULT_COLUMN_WIDTH = '100px';

  // prettier-ignore
  public static setCellEvents(etc: EditableTableComponent,
      cellElement: HTMLElement, newRowIndex: number, columnIndex: number) {
    cellElement.oninput = CellEvents.inputCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onpaste = CellEvents.pasteCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onblur = CellEvents.blurCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onfocus = CellEvents.focusCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onmouseenter = CellEvents.mouseEnterCell.bind(etc, newRowIndex, columnIndex);
    cellElement.onmouseleave = CellEvents.mouseLeaveCell.bind(etc, newRowIndex, columnIndex);
  }

  public static create(cellStyle: CSSStyle, headerStyle: CSSStyle, isHeader = false) {
    const cellElement = document.createElement(isHeader ? 'th' : 'td');
    cellElement.classList.add('cell');
    Object.assign(cellElement.style, cellStyle, isHeader ? headerStyle : {});
    return cellElement;
  }

  private static createCellDOMElement(etc: EditableTableComponent, cellText: string, isHeader: boolean) {
    const cellElement = CellElement.create(etc.cellStyle, etc.headerStyle, isHeader);
    cellElement.contentEditable = String(isHeader ? !!etc.areHeadersEditable : true);
    cellElement.textContent = cellText as string;
    if (isHeader) cellElement.style.width = CellElement.DEFAULT_COLUMN_WIDTH;
    return cellElement;
  }

  public static createCellElement(etc: EditableTableComponent, cellText: string, rowIndex: number, columnIndex: number) {
    const cellElement = CellElement.createCellDOMElement(etc, cellText, rowIndex === 0);
    CellElement.setCellEvents(etc, cellElement, rowIndex, columnIndex);
    return cellElement;
  }
}
