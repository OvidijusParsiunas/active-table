import {ColumnSettingsBorderUtils} from '../../utils/columnSettings/columnSettingsBorderUtils';
import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
import {ExtractElements} from '../../utils/elements/extractElements';
import {UpdateIndexColumnWidth} from './updateIndexColumnWidth';
import {Browser} from '../../utils/browser/browser';
import {CellElement} from '../cell/cellElement';
import {ActiveTable} from '../../activeTable';

export class IndexColumn {
  public static readonly INDEX_CELL_CLASS = 'index-cell';
  // using overflow to detect a need for width update when display style 'block' property is not set
  public static readonly INDEX_CELL_OVERFLOW_CLASS = 'index-cell-overflow';
  public static readonly DEFAULT_WIDTH = 30;
  private static readonly DEFAULT_WIDTH_PX = `${IndexColumn.DEFAULT_WIDTH}px`;

  public static updateIndexes(at: ActiveTable, startIndex: number) {
    const {tableBodyElementRef, content, dataStartsAtHeader} = at;
    const textRowsArr = ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, content, startIndex);
    const auxiliaryPaddingIndex = Number(dataStartsAtHeader);
    textRowsArr.forEach((row, rowIndex) => {
      const indexCell = row.children[0] as HTMLElement;
      const relativeIndex = startIndex + rowIndex + auxiliaryPaddingIndex;
      indexCell.innerText = String(relativeIndex);
    });
    UpdateIndexColumnWidth.update(at, textRowsArr.length === 0 ? undefined : textRowsArr);
  }

  // prettier-ignore
  private static createCell(at: ActiveTable, isHeader: boolean) {
    const {tableDimensions, columnsSettings, frameComponentsInternal: {style, cellColors}} = at;
    const cell = CellElement.createBaseCell(isHeader);
    cell.classList.add(IndexColumn.INDEX_CELL_CLASS, GenericElementUtils.NOT_SELECTABLE_CLASS);
    const {displaySettings, canEditHeaderRow} = at.rowDropdown;
    cell.style.cursor = displaySettings.openMethod?.cellClick && (!isHeader || canEditHeaderRow)
      ? 'pointer' : 'default';
    if (!tableDimensions.isColumnIndexCellTextWrapped) {
      cell.classList.add(IndexColumn.INDEX_CELL_OVERFLOW_CLASS); // REF-19
    }
    Object.assign(cell.style, columnsSettings.cellStyle, style?.default || {});
    if (isHeader) Object.assign(cell.style, columnsSettings.headerStyles?.default, cellColors.header.default);
    return cell;
  }

  private static createHeaderCell(at: ActiveTable) {
    const headerCell = IndexColumn.createCell(at, true);
    if (at.dataStartsAtHeader) headerCell.innerText = '1';
    headerCell.style.width = IndexColumn.DEFAULT_WIDTH_PX;
    // Safari does not always apply the width immediately, however do need the line above as it would otherwise cause
    // the table width to change when a row is removed
    if (Browser.IS_SAFARI) setTimeout(() => (headerCell.style.width = IndexColumn.DEFAULT_WIDTH_PX));
    return headerCell;
  }

  private static createDataCell(at: ActiveTable, rowIndex: number) {
    const dataCell = IndexColumn.createCell(at, false);
    const indexNumber = at.dataStartsAtHeader ? rowIndex + 1 : rowIndex;
    dataCell.innerText = String(indexNumber);
    return dataCell;
  }

  public static createAndPrependToRow(at: ActiveTable, rowElement: HTMLElement, rowIndex: number) {
    const cell = rowIndex === 0 ? IndexColumn.createHeaderCell(at) : IndexColumn.createDataCell(at, rowIndex);
    if (at.columnsDetails[0]) {
      ColumnSettingsBorderUtils.unsetSubjectBorder([cell], at.columnsDetails[0].elements, 'right', 0); // REF-23
    }
    // events are added in updateRowCells method
    rowElement.appendChild(cell);
  }
}
