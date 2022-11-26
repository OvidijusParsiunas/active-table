import {AuxiliaryTableContentColors} from '../../utils/auxiliaryTableContent/auxiliaryTableContentColors';
import {EditableTableComponent} from '../../editable-table-component';
import {ExtractElements} from '../../utils/elements/extractElements';
import {UpdateIndexColumnWidth} from './updateIndexColumnWidth';
import {IndexColumnEvents} from './indexColumnEvents';
import {CellElement} from '../cell/cellElement';

export class IndexColumn {
  public static readonly INDEX_CELL_CLASS = 'index-cell';
  // using overflow to detect a need for width update when display style 'block' property is not set
  public static readonly INDEX_CELL_OVERFLOW_CLASS = 'index-cell-overflow';
  public static readonly DEFAULT_WIDTH = UpdateIndexColumnWidth.WIDTH;
  private static readonly DEFAULT_WIDTH_PX = `${IndexColumn.DEFAULT_WIDTH}px`;

  public static updateIndexes(etc: EditableTableComponent, startIndex: number) {
    const {tableBodyElementRef, contents} = etc;
    const textRowsArr = ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents, startIndex);
    textRowsArr.forEach((row, rowIndex) => {
      const indexCell = row.children[0] as HTMLElement;
      const relativeIndex = startIndex + rowIndex;
      indexCell.textContent = String(relativeIndex);
    });
    UpdateIndexColumnWidth.update(etc, textRowsArr.length === 0 ? undefined : textRowsArr);
  }

  private static createCell(etc: EditableTableComponent, isHeader: boolean) {
    const cell = document.createElement(isHeader ? 'th' : 'td');
    cell.classList.add(CellElement.CELL_CLASS, IndexColumn.INDEX_CELL_CLASS);
    if (!etc.tableDimensionsInternal.isColumnIndexCellTextWrapped) {
      cell.classList.add(IndexColumn.INDEX_CELL_OVERFLOW_CLASS); // REF-19
    }
    Object.assign(cell.style, etc.cellStyle, etc.auxiliaryTableContent.style?.defaultStyle || {});
    if (isHeader) Object.assign(cell.style, AuxiliaryTableContentColors.CELL_COLORS.header.default);
    return cell;
  }

  private static createHeaderCell(etc: EditableTableComponent) {
    const headerCell = IndexColumn.createCell(etc, true);
    headerCell.style.width = IndexColumn.DEFAULT_WIDTH_PX;
    return headerCell;
  }

  private static createDataCell(etc: EditableTableComponent, rowIndex: number) {
    const dataCell = IndexColumn.createCell(etc, false);
    dataCell.textContent = String(rowIndex);
    return dataCell;
  }

  public static createAndPrependToRow(etc: EditableTableComponent, rowElement: HTMLElement, rowIndex: number) {
    const cell = rowIndex === 0 ? IndexColumn.createHeaderCell(etc) : IndexColumn.createDataCell(etc, rowIndex);
    IndexColumnEvents.setEvents(etc, cell, rowIndex);
    rowElement.appendChild(cell);
  }
}
