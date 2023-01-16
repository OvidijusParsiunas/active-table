import {StaticTableWidthUtils} from '../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {ToggleAdditionElements} from '../table/addNewElements/shared/toggleAdditionElements';
import {AddNewColumnElement} from '../table/addNewElements/column/addNewColumnElement';
import {TableDimensionsUtils} from '../../utils/tableDimensions/tableDimensionsUtils';
import {AddNewRowElement} from '../table/addNewElements/row/addNewRowElement';
import {ExtractElements} from '../../utils/elements/extractElements';
import {DEFAULT_COLUMN_WIDTH} from '../../consts/defaultColumnWidth';
import {Browser} from '../../utils/browser/browser';
import {TableElement} from '../table/tableElement';
import {ActiveTable} from '../../activeTable';
import {IndexColumn} from './indexColumn';

export class UpdateIndexColumnWidth {
  // acts as the recorded column offsetWidth
  public static WIDTH = DEFAULT_COLUMN_WIDTH;

  private static wrapColumnTextAndGetDefaultWidth(at: ActiveTable) {
    const {tableBodyElementRef, contents, tableDimensions} = at;
    ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents).forEach((row) => {
      const indexCell = row.children[0] as HTMLElement;
      indexCell.classList.remove(IndexColumn.INDEX_CELL_OVERFLOW_CLASS);
    });
    tableDimensions.isColumnIndexCellTextWrapped = true;
    ToggleAdditionElements.update(at, true, AddNewColumnElement.toggle);
    return IndexColumn.DEFAULT_WIDTH;
  }

  private static changeTableWidths(at: ActiveTable, newWidth: number) {
    const difference = newWidth - UpdateIndexColumnWidth.WIDTH;
    UpdateIndexColumnWidth.WIDTH = newWidth;
    TableElement.changeStaticWidthTotal(difference);
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(at, true);
  }

  private static changeCellAndTableWidths(at: ActiveTable, firstRow: HTMLElement, newWidth: number) {
    const headerCell = firstRow.children[0] as HTMLElement;
    UpdateIndexColumnWidth.changeTableWidths(at, newWidth);
    // needs to be done after changeTableWidths because isTableAtMaxWidth would not return true
    headerCell.style.width = `${newWidth}px`;
  }

  private static forceWrap(at: ActiveTable, firstRow: HTMLElement) {
    const newWidth = UpdateIndexColumnWidth.wrapColumnTextAndGetDefaultWidth(at);
    UpdateIndexColumnWidth.changeCellAndTableWidths(at, firstRow, newWidth);
  }

  private static shouldTextBeWrapped(at: ActiveTable) {
    return !at.tableDimensions.isColumnIndexCellTextWrapped && TableDimensionsUtils.hasSetTableWidthBeenBreached(at);
  }

  private static changeWidth(at: ActiveTable, firstRow: HTMLElement, newWidth: number) {
    UpdateIndexColumnWidth.changeCellAndTableWidths(at, firstRow, newWidth);
    // if the above has set the width too high
    if (UpdateIndexColumnWidth.shouldTextBeWrapped(at)) UpdateIndexColumnWidth.forceWrap(at, firstRow);
  }

  private static getCellOverflow(cell: HTMLElement) {
    return cell.scrollWidth + (Number.parseInt(cell.style.borderRightWidth) || 0);
  }

  private static getIndexColumnOverflowWidth(firstRow: HTMLElement, lastCell: HTMLElement) {
    const overflowWidth = UpdateIndexColumnWidth.getCellOverflow(lastCell);
    // if using pagination and the last row is not visible, then overflowWidth will be 0 and we must temporarily add
    // the last cell contents to the first data row cell to measure the overflow
    if (overflowWidth === 0) {
      const firstDataRow = firstRow.nextSibling as HTMLElement;
      if (firstDataRow && !AddNewRowElement.isAddNewRowRow(firstDataRow)) {
        const firstDataCell = firstDataRow.children[0] as HTMLElement;
        const firstCellContent = firstDataCell.textContent;
        firstDataCell.textContent = lastCell.textContent;
        setTimeout(() => (firstDataCell.textContent = firstCellContent));
        return UpdateIndexColumnWidth.getCellOverflow(firstDataCell);
      }
    }
    return overflowWidth;
  }

  // this works because the 'block' display style is not set on the table
  // checking if the cells width is overflown and if so - increase its width (cannot decrease the width)
  private static updateColumnWidthWhenOverflow(at: ActiveTable, firstRow: HTMLElement, lastCell: HTMLElement) {
    // overflow width does not include the borderRightWidth - which the ChangeIndexColumnWidth.WIDTH does
    const overflowWidth = UpdateIndexColumnWidth.getIndexColumnOverflowWidth(firstRow, lastCell);
    if (UpdateIndexColumnWidth.WIDTH !== overflowWidth && overflowWidth !== 0) {
      // Firefox does not include lastCell paddingRight (4px) when setting the new width
      const newWidth = overflowWidth + (Browser.IS_FIREFOX ? 4 : 0);
      if (Browser.IS_SAFARI) {
        setTimeout(() => UpdateIndexColumnWidth.changeWidth(at, firstRow, newWidth));
      } else {
        UpdateIndexColumnWidth.changeWidth(at, firstRow, newWidth);
      }
    }
  }

  // when the table element display property is 'block', the 'overflow: hidden;' property does not actually work
  // and instead the lastCell width is change automatically, all we do here is check if the expected width
  // (ChangeIndexColumnWidth.WIDTH) is different to the actual one and if so, we change it to actual
  private static checkAutoColumnWidthUpdate(at: ActiveTable, lastCell: HTMLElement) {
    if (lastCell.offsetWidth !== UpdateIndexColumnWidth.WIDTH) {
      let newWidth = lastCell.offsetWidth;
      if (at.offsetWidth !== at.scrollWidth) {
        newWidth = UpdateIndexColumnWidth.wrapColumnTextAndGetDefaultWidth(at);
      }
      UpdateIndexColumnWidth.changeTableWidths(at, newWidth);
    }
  }

  private static updatedBasedOnTableStyle(at: ActiveTable, lastCell: HTMLElement, forceWrap = false) {
    const firstRow = (at.tableBodyElementRef as HTMLElement).children[0] as HTMLElement;
    if (forceWrap) {
      UpdateIndexColumnWidth.forceWrap(at, firstRow);
      // when 'block' display style is not set on the table
    } else if (at.tableDimensions.preserveNarrowColumns || at.tableDimensions.maxWidth !== undefined) {
      UpdateIndexColumnWidth.updateColumnWidthWhenOverflow(at, firstRow, lastCell);
    } else if (at.tableDimensions.width !== undefined) {
      UpdateIndexColumnWidth.checkAutoColumnWidthUpdate(at, lastCell);
    }
  }

  // used when a new row is added
  // forceWrap - REF-19
  public static update(at: ActiveTable, textRowsArr?: Element[], forceWrap = false) {
    if (at.tableDimensions.isColumnIndexCellTextWrapped) return;
    if (!textRowsArr) {
      const {tableBodyElementRef, contents} = at;
      textRowsArr = ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents);
    }
    const lastCell = textRowsArr[textRowsArr.length - 1]?.children[0] as HTMLElement;
    if (lastCell) UpdateIndexColumnWidth.updatedBasedOnTableStyle(at, lastCell, forceWrap);
  }

  // used when a new column is added to see if wrapping is needed
  // CAUTION-2 - this runs before re-render but stay cautions
  public static wrapTextWhenNarrowColumnsBreached(at: ActiveTable) {
    if (at.auxiliaryTableContentInternal.displayIndexColumn && UpdateIndexColumnWidth.shouldTextBeWrapped(at)) {
      UpdateIndexColumnWidth.update(at, undefined, true);
    }
  }
}
