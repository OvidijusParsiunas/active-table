import {EditableTableComponent} from '../../../editable-table-component';
import {ExtractElements} from '../../../utils/elements/extractElements';
import {TableContents} from '../../../types/tableContents';
import {CellElement} from '../../cell/cellElement';

export class IndexColumn {
  public static readonly INDEX_CELL_CLASS = 'index-cell';
  public static readonly DEFAULT_WIDTH = 30;
  private static readonly DEFAULT_WIDTH_PX = `${IndexColumn.DEFAULT_WIDTH}px`;

  public static updateIndexes(tableBodyElement: HTMLElement, contents: TableContents, startIndex: number) {
    ExtractElements.textRowsArrFromTBody(tableBodyElement, contents, startIndex).forEach((row, rowIndex) => {
      const indexCell = row.children[0] as HTMLElement;
      const relativeIndex = startIndex + rowIndex;
      indexCell.textContent = String(relativeIndex);
    });
  }

  private static createCell(etc: EditableTableComponent, tag: 'th' | 'td') {
    const cell = document.createElement(tag);
    cell.classList.add(CellElement.CELL_CLASS, IndexColumn.INDEX_CELL_CLASS, CellElement.HOVERABLE_CELL_CLASS);
    Object.assign(cell.style, etc.cellStyle);
    return cell;
  }

  private static createHeaderCell(etc: EditableTableComponent) {
    const headerCell = IndexColumn.createCell(etc, 'th');
    headerCell.style.width = IndexColumn.DEFAULT_WIDTH_PX;
    Object.assign(headerCell.style, etc.headerStyle);
    return headerCell;
  }

  private static createDataCell(etc: EditableTableComponent, rowIndex: number) {
    const dataCell = IndexColumn.createCell(etc, 'td');
    dataCell.textContent = String(rowIndex);
    return dataCell;
  }

  public static createAndPrependToRow(etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number) {
    const cell = rowIndex === 0 ? IndexColumn.createHeaderCell(etc) : IndexColumn.createDataCell(etc, rowIndex);
    rowElement.appendChild(cell);
  }
}
